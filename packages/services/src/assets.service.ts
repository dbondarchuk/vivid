import { getDbConnection } from "./database";

import {
  Asset,
  AssetUpdate,
  IAssetsService,
  IAssetsStorage,
  IConfigurationService,
  IConnectedAppService,
  Query,
  WithTotal,
} from "@vivid/types";
import { buildSearchQuery, escapeRegex } from "@vivid/utils";

import { DateTime } from "luxon";
import { Filter, ObjectId, Sort } from "mongodb";
import { Readable } from "stream";

export const ASSETS_COLLECTION_NAME = "assets";

export class AssetsService implements IAssetsService {
  constructor(
    protected readonly configurationService: IConfigurationService,
    protected readonly connectedAppService: IConnectedAppService
  ) {}

  public async getAsset(_id: string): Promise<Asset | null> {
    const db = await getDbConnection();
    const assets = db.collection<Asset>(ASSETS_COLLECTION_NAME);

    const asset = await assets.findOne({
      _id,
    });

    return asset;
  }

  public async getAssets(
    query: Query & {
      mimeType?: string;
    }
  ): Promise<WithTotal<Asset>> {
    const db = await getDbConnection();

    const sort: Sort = query.sort?.reduce(
      (prev, curr) => ({
        ...prev,
        [curr.key]: curr.desc ? -1 : 1,
      }),
      {}
    ) || { uploadedAt: -1 };

    const filter: Filter<Asset> = {};

    if (query.search) {
      const $regex = new RegExp(query.search, "i");
      const queries = buildSearchQuery<Asset>(
        { $regex },
        "filename",
        "mimeType",
        "description"
      );

      filter.$or = queries;
    }

    if (query.mimeType) {
      filter.$and = [
        {
          mimeType: {
            $regex: `^${escapeRegex(query.mimeType)}`,
          },
        },
      ];
    }

    const [result] = await db
      .collection<Asset>(ASSETS_COLLECTION_NAME)
      .aggregate([
        {
          $sort: sort,
        },
        {
          $match: filter,
        },
        {
          $facet: {
            paginatedResults: [
              { $skip: query.offset || 0 },
              { $limit: query.limit || 1000000000000000 },
            ],
            totalCount: [
              {
                $count: "count",
              },
            ],
          },
        },
      ])
      .toArray();

    return {
      total: result.totalCount?.[0]?.count || 0,
      items: result.paginatedResults || [],
    };
  }

  public async createAsset(
    asset: Omit<Asset, "_id" | "uploadedAt">,
    file: Buffer
  ): Promise<Asset> {
    const storage = await this.getAssetsStorage();

    const db = await getDbConnection();
    const assets = db.collection<Asset>(ASSETS_COLLECTION_NAME);

    const existing = await assets.findOne({
      filename: asset.filename,
    });

    if (!!existing) {
      throw new Error(`File '${asset.filename}' already exists`);
    }

    await storage.service.saveFile(storage.app, asset.filename, file);

    const dbAsset: Asset = {
      ...asset,
      _id: new ObjectId().toString(),
      uploadedAt: DateTime.utc().toJSDate(),
      size: file.byteLength,
    };

    await assets.insertOne(dbAsset);

    return dbAsset;
  }

  public async updateAsset(id: string, update: AssetUpdate): Promise<void> {
    const db = await getDbConnection();
    const assets = db.collection<Asset>(ASSETS_COLLECTION_NAME);

    const { _id, filename, uploadedAt, mimeType, ...updateObj } =
      update as Asset; // Remove fields in case it slips here

    await assets.updateOne(
      {
        _id: id,
      },
      {
        $set: updateObj,
      }
    );
  }

  public async deleteAsset(id: string): Promise<Asset | undefined> {
    const storage = await this.getAssetsStorage();

    const db = await getDbConnection();
    const assets = db.collection<Asset>(ASSETS_COLLECTION_NAME);

    const asset = await assets.findOne({ _id: id });
    if (!asset) return undefined;

    await assets.deleteOne({
      _id: id,
    });

    await storage.service.deleteFile(storage.app, asset.filename);

    return asset;
  }

  public async deleteAssets(ids: string[]): Promise<Asset[]> {
    const storage = await this.getAssetsStorage();

    const db = await getDbConnection();
    const assets = db.collection<Asset>(ASSETS_COLLECTION_NAME);

    const toRemove = await assets
      .find({
        _id: {
          $in: ids,
        },
      })
      .toArray();

    await assets.deleteMany({
      _id: {
        $in: ids,
      },
    });

    await storage.service.deleteFiles(
      storage.app,
      toRemove.map((asset) => asset.filename)
    );

    return toRemove;
  }

  public async checkUniqueFileName(
    filename: string,
    _id?: string
  ): Promise<boolean> {
    const db = await getDbConnection();
    const assets = db.collection<Asset>(ASSETS_COLLECTION_NAME);

    const filter: Filter<Asset> = {
      filename,
    };

    if (_id) {
      filter._id = {
        $ne: _id,
      };
    }

    const result = await assets.countDocuments(filter);
    return result === 0;
  }

  public async streamAsset(
    filename: string
  ): Promise<{ stream: Readable; asset: Asset } | null> {
    const storage = await this.getAssetsStorage();

    const db = await getDbConnection();
    const assets = db.collection<Asset>(ASSETS_COLLECTION_NAME);

    const asset = await assets.findOne({
      filename,
    });

    if (!asset) return null;

    const stream = await storage.service.getFile(storage.app, filename);
    return { stream, asset };
  }

  private async getAssetsStorage() {
    const defaultAppsConfiguration =
      await this.configurationService.getConfiguration("defaultApps");

    const assetsStorageAppId = defaultAppsConfiguration?.assetsStorage.appId;

    return await this.connectedAppService.getAppService<IAssetsStorage>(
      assetsStorageAppId
    );
  }
}
