import { getDbConnection } from "@/database";
import { buildSearchQuery } from "@/lib/query";
import { Asset, AssetUpdate, WithTotal } from "@/types";
import { Query } from "@/types/database/query";
import { DateTime } from "luxon";
import { Filter, ObjectId, Sort } from "mongodb";

export const ASSETS_COLLECTION_NAME = "assets";

export class AssetsService {
  public async getAsset(_id: string): Promise<Asset | null> {
    const db = await getDbConnection();
    const assets = db.collection<Asset>(ASSETS_COLLECTION_NAME);

    const asset = await assets.findOne({
      _id,
    });

    return asset;
  }

  public async getAssets(query: Query): Promise<WithTotal<Asset>> {
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
        "description"
      );

      filter.$or = queries;
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
    asset: Omit<Asset, "_id" | "uploadedAt">
  ): Promise<Asset> {
    const dbAsset: Asset = {
      ...asset,
      _id: new ObjectId().toString(),
      uploadedAt: DateTime.utc().toJSDate(),
    };

    const db = await getDbConnection();
    const assets = db.collection<Asset>(ASSETS_COLLECTION_NAME);

    await assets.insertOne(dbAsset);

    return dbAsset;
  }

  public async updateAsset(id: string, update: AssetUpdate): Promise<void> {
    const db = await getDbConnection();
    const assets = db.collection<Asset>(ASSETS_COLLECTION_NAME);

    const { _id, filename, uploadedAt, ...updateObj } = update as Asset; // Remove fields in case it slips here

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
    const db = await getDbConnection();
    const assets = db.collection<Asset>(ASSETS_COLLECTION_NAME);

    const asset = await assets.findOne({ _id: id });
    if (!asset) return undefined;

    await assets.deleteOne({
      _id: id,
    });

    return asset;
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
}
