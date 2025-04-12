import {
  IPagesService,
  Page,
  PageUpdateModel,
  Query,
  WithTotal,
} from "@vivid/types";
import { buildSearchQuery } from "@vivid/utils";
import { DateTime } from "luxon";
import { Filter, ObjectId, Sort } from "mongodb";
import { getDbConnection } from "./database";

export const PAGES_COLLECTION_NAME = "pages";

export class PagesService implements IPagesService {
  public async getPage(id: string): Promise<Page | null> {
    const db = await getDbConnection();
    const pages = db.collection<Page>(PAGES_COLLECTION_NAME);

    const page = await pages.findOne({
      _id: id,
    });

    return page;
  }

  public async getPageBySlug(slug: string): Promise<Page | null> {
    const db = await getDbConnection();
    const pages = db.collection<Page>(PAGES_COLLECTION_NAME);

    const page = await pages.findOne({
      slug,
    });

    return page;
  }

  public async getPages(
    query: Query & {
      publishStatus: boolean[];
      maxPublishDate?: Date;
      tags?: string[];
    }
  ): Promise<WithTotal<Page>> {
    const db = await getDbConnection();

    const sort: Sort = query.sort?.reduce(
      (prev, curr) => ({
        ...prev,
        [curr.id]: curr.desc ? -1 : 1,
      }),
      {}
    ) || { updatedAt: -1 };

    const filter: Filter<Page> = {};

    if (query.publishStatus) {
      filter.published = {
        $in: query.publishStatus,
      };
    }

    if (query.maxPublishDate) {
      filter.publishDate = {
        $lte: query.maxPublishDate,
      };
    }

    if (query.tags) {
      filter.tags = {
        $all: query.tags,
      };
    }

    if (query.search) {
      const $regex = new RegExp(query.search, "i");
      const queries = buildSearchQuery<Page>(
        { $regex },
        "slug",
        "keywords",
        "title",
        "content",
        "description"
      );

      filter.$or = queries;
    }

    const [result] = await db
      .collection<Page>(PAGES_COLLECTION_NAME)
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

  public async createPage(page: PageUpdateModel): Promise<Page> {
    const dbPage: Page = {
      ...page,
      _id: new ObjectId().toString(),
      updatedAt: DateTime.utc().toJSDate(),
      createdAt: DateTime.utc().toJSDate(),
    };

    if (!this.checkUniqueSlug(page.slug)) {
      throw new Error("Slug already exists");
    }

    const db = await getDbConnection();
    const pages = db.collection<Page>(PAGES_COLLECTION_NAME);

    await pages.insertOne(dbPage);

    return dbPage;
  }

  public async updatePage(id: string, update: PageUpdateModel): Promise<void> {
    const db = await getDbConnection();
    const pages = db.collection<Page>(PAGES_COLLECTION_NAME);

    const { _id, ...updateObj } = update as Page; // Remove fields in case it slips here

    if (!this.checkUniqueSlug(update.slug, id)) {
      throw new Error("Slug already exists");
    }

    updateObj.updatedAt = DateTime.utc().toJSDate();

    await pages.updateOne(
      {
        _id: id,
      },
      {
        $set: updateObj,
      }
    );
  }

  public async deletePage(id: string): Promise<Page | null> {
    const db = await getDbConnection();
    const pages = db.collection<Page>(PAGES_COLLECTION_NAME);

    const page = await pages.findOne({ _id: id });
    if (!page) return null;
    if (page.slug === "home") {
      throw new Error("Can not delete home page");
    }

    await pages.deleteOne({
      _id: id,
    });

    return page;
  }

  public async deletePages(ids: string[]): Promise<void> {
    const db = await getDbConnection();
    const pages = db.collection<Page>(PAGES_COLLECTION_NAME);

    const homePage = await pages.findOne({
      _id: {
        $in: ids,
      },
      slug: "home",
    });

    if (homePage) {
      throw new Error("Can not delete home page");
    }

    await pages.deleteMany({
      _id: {
        $in: ids,
      },
    });
  }

  public async checkUniqueSlug(slug: string, id?: string): Promise<boolean> {
    const db = await getDbConnection();
    const pages = db.collection<Page>(PAGES_COLLECTION_NAME);

    const filter: Filter<Page> = {
      slug,
    };

    if (id) {
      filter._id = {
        $ne: id,
      };
    }

    const result = await pages.countDocuments(filter);
    return result === 0;
  }
}
