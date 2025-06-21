import { getLoggerFactory } from "@vivid/logger";
import {
  IPagesService,
  Page,
  PageUpdateModel,
  Query,
  WithTotal,
} from "@vivid/types";
import { buildSearchQuery, escapeRegex } from "@vivid/utils";
import { DateTime } from "luxon";
import { Filter, ObjectId, Sort } from "mongodb";
import { getDbConnection } from "./database";

export const PAGES_COLLECTION_NAME = "pages";

export class PagesService implements IPagesService {
  protected readonly loggerFactory = getLoggerFactory("PagesService");

  public async getPage(id: string): Promise<Page | null> {
    const logger = this.loggerFactory("getPage");
    logger.debug({ pageId: id }, "Getting page by id");

    const db = await getDbConnection();
    const pages = db.collection<Page>(PAGES_COLLECTION_NAME);

    const page = await pages.findOne({
      _id: id,
    });

    if (!page) {
      logger.warn({ pageId: id }, "Page not found");
    } else {
      logger.debug(
        {
          pageId: id,
          title: page.title,
          slug: page.slug,
          published: page.published,
        },
        "Page found"
      );
    }

    return page;
  }

  public async getPageBySlug(slug: string): Promise<Page | null> {
    const logger = this.loggerFactory("getPageBySlug");
    logger.debug({ slug }, "Getting page by slug");

    const db = await getDbConnection();
    const pages = db.collection<Page>(PAGES_COLLECTION_NAME);

    const page = await pages.findOne({
      slug,
    });

    if (!page) {
      logger.warn({ slug }, "Page not found by slug");
    } else {
      logger.debug(
        {
          slug,
          pageId: page._id,
          title: page.title,
          published: page.published,
        },
        "Page found by slug"
      );
    }

    return page;
  }

  public async getPages(
    query: Query & {
      publishStatus: boolean[];
      maxPublishDate?: Date;
      tags?: string[];
    }
  ): Promise<WithTotal<Page>> {
    const logger = this.loggerFactory("getPages");
    logger.debug({ query }, "Getting pages");

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
      const $regex = new RegExp(escapeRegex(query.search), "i");
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
            paginatedResults:
              query.limit === 0
                ? undefined
                : [
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

    const response = {
      total: result.totalCount?.[0]?.count || 0,
      items: result.paginatedResults || [],
    };

    logger.debug(
      {
        query,
        result: { total: response.total, count: response.items.length },
      },
      "Fetched pages"
    );

    return response;
  }

  public async createPage(page: PageUpdateModel): Promise<Page> {
    const logger = this.loggerFactory("createPage");
    logger.debug(
      { page: { slug: page.slug, title: page.title } },
      "Creating new page"
    );

    const dbPage: Page = {
      ...page,
      _id: new ObjectId().toString(),
      updatedAt: DateTime.utc().toJSDate(),
      createdAt: DateTime.utc().toJSDate(),
    };

    if (!this.checkUniqueSlug(page.slug)) {
      logger.error({ slug: page.slug }, "Slug already exists");
      throw new Error("Slug already exists");
    }

    const db = await getDbConnection();
    const pages = db.collection<Page>(PAGES_COLLECTION_NAME);

    await pages.insertOne(dbPage);

    logger.debug(
      { pageId: dbPage._id, slug: dbPage.slug },
      "Successfully created page"
    );

    return dbPage;
  }

  public async updatePage(id: string, update: PageUpdateModel): Promise<void> {
    const logger = this.loggerFactory("updatePage");
    logger.debug(
      { pageId: id, update: { slug: update.slug, title: update.title } },
      "Updating page"
    );

    const db = await getDbConnection();
    const pages = db.collection<Page>(PAGES_COLLECTION_NAME);

    const { _id, ...updateObj } = update as Page; // Remove fields in case it slips here

    if (!this.checkUniqueSlug(update.slug, id)) {
      logger.error({ pageId: id, slug: update.slug }, "Slug already exists");
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

    logger.debug({ pageId: id }, "Successfully updated page");
  }

  public async deletePage(id: string): Promise<Page | null> {
    const logger = this.loggerFactory("deletePage");
    logger.debug({ pageId: id }, "Deleting page");

    const db = await getDbConnection();
    const pages = db.collection<Page>(PAGES_COLLECTION_NAME);

    const page = await pages.findOne({ _id: id });
    if (!page) {
      logger.warn({ pageId: id }, "Page not found for deletion");
      return null;
    }
    if (page.slug === "home") {
      logger.error({ pageId: id, slug: page.slug }, "Cannot delete home page");
      throw new Error("Can not delete home page");
    }

    await pages.deleteOne({
      _id: id,
    });

    logger.debug({ pageId: id, slug: page.slug }, "Successfully deleted page");

    return page;
  }

  public async deletePages(ids: string[]): Promise<void> {
    const logger = this.loggerFactory("deletePages");
    logger.debug({ pageIds: ids }, "Deleting multiple pages");

    const db = await getDbConnection();
    const pages = db.collection<Page>(PAGES_COLLECTION_NAME);

    const homePage = await pages.findOne({
      _id: {
        $in: ids,
      },
      slug: "home",
    });

    if (homePage) {
      logger.error({ pageIds: ids }, "Cannot delete home page");
      throw new Error("Can not delete home page");
    }

    const { deletedCount } = await pages.deleteMany({
      _id: {
        $in: ids,
      },
    });

    logger.debug(
      { pageIds: ids, count: deletedCount },
      "Successfully deleted multiple pages"
    );
  }

  public async checkUniqueSlug(slug: string, id?: string): Promise<boolean> {
    const logger = this.loggerFactory("checkUniqueSlug");
    logger.debug({ slug, id }, "Checking unique slug");
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

    const hasNext = await pages.aggregate([{ $match: filter }]).hasNext();

    logger.debug({ slug, id, hasNext }, "Slug check result");
    return !hasNext;
  }
}
