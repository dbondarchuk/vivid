import {
  CommunicationChannel,
  ITemplatesService,
  Query,
  Template,
  TemplateUpdateModel,
  WithTotal,
} from "@vivid/types";
import { buildSearchQuery } from "@vivid/utils";
import { DateTime } from "luxon";
import { Filter, ObjectId, Sort } from "mongodb";
import { getDbConnection } from "./database";

export const TEMPLATES_COLLECTION_NAME = "templates";

export class TemplatesService implements ITemplatesService {
  public async getTemplate(_id: string): Promise<Template | null> {
    const db = await getDbConnection();
    const templates = db.collection<Template>(TEMPLATES_COLLECTION_NAME);

    const template = await templates.findOne({
      _id,
    });

    return template;
  }

  public async getTemplates(
    type: CommunicationChannel,
    query: Query
  ): Promise<WithTotal<Template>> {
    const db = await getDbConnection();

    const sort: Sort = query.sort?.reduce(
      (prev, curr) => ({
        ...prev,
        [curr.id]: curr.desc ? -1 : 1,
      }),
      {}
    ) || { updatedAt: -1 };

    const filter: Filter<Template> = {
      type,
    };

    if (query.search) {
      const $regex = new RegExp(query.search, "i");
      const queries = buildSearchQuery<Template>({ $regex }, "name");

      filter.$or = queries;
    }

    const [result] = await db
      .collection<Template>(TEMPLATES_COLLECTION_NAME)
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

  public async createTemplate(
    template: TemplateUpdateModel
  ): Promise<Template> {
    const dbTemplate: Template = {
      ...template,
      _id: new ObjectId().toString(),
      updatedAt: DateTime.utc().toJSDate(),
    };

    if (!this.checkUniqueName(template.name)) {
      throw new Error("Name already exists");
    }

    const db = await getDbConnection();
    const templates = db.collection<Template>(TEMPLATES_COLLECTION_NAME);

    await templates.insertOne(dbTemplate);

    return dbTemplate;
  }

  public async updateTemplate(
    id: string,
    update: TemplateUpdateModel
  ): Promise<void> {
    const db = await getDbConnection();
    const templates = db.collection<Template>(TEMPLATES_COLLECTION_NAME);

    const { _id, ...updateObj } = update as Template; // Remove fields in case it slips here

    if (!this.checkUniqueName(update.name, id)) {
      throw new Error("Name already exists");
    }

    updateObj.updatedAt = DateTime.utc().toJSDate();

    await templates.updateOne(
      {
        _id: id,
      },
      {
        $set: updateObj,
      }
    );
  }

  public async deleteTemplate(id: string): Promise<Template | undefined> {
    const db = await getDbConnection();
    const templates = db.collection<Template>(TEMPLATES_COLLECTION_NAME);

    const template = await templates.findOneAndDelete({
      _id: id,
    });

    return template || undefined;
  }

  public async deleteTemplates(ids: string[]): Promise<void> {
    const db = await getDbConnection();
    const templates = db.collection<Template>(TEMPLATES_COLLECTION_NAME);

    await templates.deleteMany({
      _id: {
        $in: ids,
      },
    });
  }

  public async checkUniqueName(name: string, id?: string): Promise<boolean> {
    const db = await getDbConnection();
    const templates = db.collection<Template>(TEMPLATES_COLLECTION_NAME);

    const filter: Filter<Template> = {
      name,
    };

    if (id) {
      filter._id = {
        $ne: id,
      };
    }

    const result = await templates.countDocuments(filter);
    return result === 0;
  }
}
