import { getDbConnection } from "./database";

import {
  Asset,
  AssetEntity,
  AssetUpdate,
  IAssetsService,
  IAssetsStorage,
  IConfigurationService,
  IConnectedAppsService,
  Query,
  WithTotal,
} from "@vivid/types";
import { buildSearchQuery, escapeRegex } from "@vivid/utils";

import { DateTime } from "luxon";
import { Filter, ObjectId, Sort } from "mongodb";
import { Readable } from "stream";
import { CUSTOMERS_COLLECTION_NAME } from "./customers.service";
import { APPOINTMENTS_COLLECTION_NAME } from "./events.service";

export const ASSETS_COLLECTION_NAME = "assets";

export class AssetsService implements IAssetsService {
  constructor(
    protected readonly configurationService: IConfigurationService,
    protected readonly connectedAppService: IConnectedAppsService
  ) {}

  public async getAsset(_id: string): Promise<Asset | null> {
    const db = await getDbConnection();
    const assets = db.collection<AssetEntity>(ASSETS_COLLECTION_NAME);

    const asset = await assets
      .aggregate([
        {
          $match: {
            _id,
          },
        },
        ...this.aggregateJoin,
      ])
      .next();

    return asset as Asset | null;
  }

  public async getAssets(
    query: Query & {
      accept?: string[];
      customerId?: string | string[];
      appointmentId?: string | string[];
    }
  ): Promise<WithTotal<Asset>> {
    const db = await getDbConnection();

    const sort: Sort = query.sort?.reduce(
      (prev, curr) => ({
        ...prev,
        [curr.id]: curr.desc ? -1 : 1,
      }),
      {}
    ) || { uploadedAt: -1 };

    const filter: Filter<Asset> = {};

    if (query.search) {
      const $regex = new RegExp(escapeRegex(query.search), "i");
      const queries = buildSearchQuery<Asset>(
        { $regex },
        "filename",
        "mimeType",
        "description"
      );

      filter.$or = queries;
    }

    if (query.accept?.length) {
      filter.$and = [
        {
          $or: query.accept
            .filter((accept) => !!accept)
            .map((accept) => ({
              mimeType: {
                $regex: `^${accept.replaceAll("*", ".*")}$`,
              },
            })),
        },
      ];
    }

    if (query.customerId) {
      filter["customer._id"] = {
        $in: Array.isArray(query.customerId)
          ? query.customerId
          : [query.customerId],
      };
    }

    if (query.appointmentId) {
      filter.appointmentId = {
        $in: Array.isArray(query.appointmentId)
          ? query.appointmentId
          : [query.appointmentId],
      };
    }

    const [result] = await db
      .collection<AssetEntity>(ASSETS_COLLECTION_NAME)
      .aggregate([
        ...this.aggregateJoin,
        {
          $match: filter,
        },
        {
          $sort: sort,
        },
        {
          $facet: {
            paginatedResults: [
              ...(typeof query.offset !== "undefined"
                ? [{ $skip: query.offset }]
                : []),
              ...(typeof query.limit !== "undefined"
                ? [{ $limit: query.limit }]
                : []),
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
    file: File
  ): Promise<AssetEntity> {
    const storage = await this.getAssetsStorage();

    const db = await getDbConnection();
    const assets = db.collection<AssetEntity>(ASSETS_COLLECTION_NAME);

    const existing = await assets.findOne({
      filename: asset.filename,
    });

    if (!!existing) {
      throw new Error(`File '${asset.filename}' already exists`);
    }

    await storage.service.saveFile(
      storage.app,
      asset.filename,
      Readable.fromWeb(file.stream() as any),
      file.size
    );

    const dbAsset: Asset = {
      ...asset,
      _id: new ObjectId().toString(),
      uploadedAt: DateTime.utc().toJSDate(),
      size: file.size,
    };

    await assets.insertOne(dbAsset);

    return dbAsset;
  }

  public async updateAsset(id: string, update: AssetUpdate): Promise<void> {
    const db = await getDbConnection();
    const assets = db.collection<AssetEntity>(ASSETS_COLLECTION_NAME);

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
    const assets = db.collection<AssetEntity>(ASSETS_COLLECTION_NAME);

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
    const assets = db.collection<AssetEntity>(ASSETS_COLLECTION_NAME);

    const filter: Filter<AssetEntity> = {
      filename,
    };

    if (_id) {
      filter._id = {
        $ne: _id,
      };
    }

    const hasNext = await assets
      .aggregate([
        {
          $match: filter,
        },
      ])
      .hasNext();

    return !hasNext;
  }

  public async streamAsset(
    filename: string
  ): Promise<{ stream: Readable; asset: AssetEntity } | null> {
    const storage = await this.getAssetsStorage();

    const db = await getDbConnection();
    const assets = db.collection<AssetEntity>(ASSETS_COLLECTION_NAME);

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

  private get aggregateJoin() {
    return [
      {
        $lookup: {
          from: APPOINTMENTS_COLLECTION_NAME,
          localField: "appointmentId",
          foreignField: "_id",
          as: "appointment",
        },
      },
      {
        $lookup: {
          from: CUSTOMERS_COLLECTION_NAME,
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $set: {
          appointment: {
            $first: "$appointment",
          },
          customer: {
            $first: "$customer",
          },
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "appointment.customerId",
          foreignField: "_id",
          as: "appointmentCustomer",
        },
      },
      {
        $set: {
          customer: {
            $ifNull: ["$customer", { $first: "$appointmentCustomer" }],
          },
        },
      },
      {
        $unset: "appointmentCustomer",
      },
    ];
  }
}
