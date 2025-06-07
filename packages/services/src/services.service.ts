import {
  AddonsType,
  AppointmentAddon,
  AppointmentAddonUpdateModel,
  AppointmentOption,
  AppointmentOptionUpdateModel,
  ConfigurationOption,
  FieldsType,
  FieldType,
  IServicesService,
  Query,
  ServiceField,
  ServiceFieldUpdateModel,
  WithTotal,
} from "@vivid/types";
import { buildSearchQuery, escapeRegex } from "@vivid/utils";
import { DateTime } from "luxon";
import { Filter, ObjectId, Sort } from "mongodb";
import { CONFIGURATION_COLLECTION_NAME } from "./configuration.service";
import { getDbConnection } from "./database";

export const FIELDS_COLLECTION_NAME = "fields";
export const ADDONS_COLLECTION_NAME = "addons";
export const OPTIONS_COLLECTION_NAME = "options";

export class ServicesService implements IServicesService {
  /** Fields */

  public async getField(id: string): Promise<ServiceField | null> {
    const db = await getDbConnection();
    const fields = db.collection<ServiceField>(FIELDS_COLLECTION_NAME);

    const field = await fields.findOne({
      _id: id,
    });

    return field;
  }

  public async getFields<T extends boolean | undefined>(
    query: Query & {
      type: FieldType[];
    },
    includeUsage?: T
  ): Promise<WithTotal<FieldsType<T>>> {
    const db = await getDbConnection();

    const sort: Sort = query.sort?.reduce(
      (prev, curr) => ({
        ...prev,
        [curr.id]: curr.desc ? -1 : 1,
      }),
      {}
    ) || { updatedAt: -1 };

    const filter: Filter<ServiceField> = {};

    if (query.type) {
      filter.type = {
        $in: query.type,
      };
    }

    if (query.search) {
      const $regex = new RegExp(escapeRegex(query.search), "i");
      const queries = buildSearchQuery<ServiceField>(
        { $regex },
        "name",
        "data.description",
        "data.label",
        "data.options"
      );

      filter.$or = queries;
    }

    const [result] = await db
      .collection<ServiceField>(FIELDS_COLLECTION_NAME)
      .aggregate([
        {
          $sort: sort,
        },
        {
          $match: filter,
        },
        ...(includeUsage
          ? [
              {
                $lookup: {
                  from: ADDONS_COLLECTION_NAME,
                  localField: "_id",
                  foreignField: "fields.id",
                  pipeline: [
                    {
                      $project: {
                        _id: 1,
                        name: 1,
                      },
                    },
                  ],
                  as: "addons",
                },
              },
              {
                $lookup: {
                  from: OPTIONS_COLLECTION_NAME,
                  localField: "_id",
                  foreignField: "fields.id",
                  pipeline: [
                    {
                      $project: {
                        _id: 1,
                        name: 1,
                      },
                    },
                  ],
                  as: "options",
                },
              },
            ]
          : []),
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

  public async getFieldsById(ids: string[]): Promise<ServiceField[]> {
    const db = await getDbConnection();
    const fields = db.collection<ServiceField>(FIELDS_COLLECTION_NAME);

    return await fields
      .find({
        _id: {
          $in: ids,
        },
      })
      .toArray();
  }

  public async createField(
    field: ServiceFieldUpdateModel
  ): Promise<ServiceField> {
    const dbField: ServiceField = {
      ...field,
      _id: new ObjectId().toString(),
      updatedAt: DateTime.utc().toJSDate(),
    };

    if (!this.checkFieldUniqueName(field.name)) {
      throw new Error("Name already exists");
    }

    const db = await getDbConnection();
    const fields = db.collection<ServiceField>(FIELDS_COLLECTION_NAME);

    await fields.insertOne(dbField);

    return dbField;
  }

  public async updateField(
    id: string,
    update: ServiceFieldUpdateModel
  ): Promise<void> {
    const db = await getDbConnection();
    const fields = db.collection<ServiceField>(FIELDS_COLLECTION_NAME);

    const { _id, ...updateObj } = update as ServiceField; // Remove fields in case it slips here

    if (!this.checkFieldUniqueName(update.name, id)) {
      throw new Error("Name already exists");
    }

    updateObj.updatedAt = DateTime.utc().toJSDate();

    await fields.updateOne(
      {
        _id: id,
      },
      {
        $set: updateObj,
      }
    );
  }

  public async deleteField(id: string): Promise<ServiceField | null> {
    const db = await getDbConnection();
    const fields = db.collection<ServiceField>(FIELDS_COLLECTION_NAME);

    const field = await fields.findOne({ _id: id });
    //if (!field) return null;

    await fields.deleteOne({
      _id: id,
    });

    const addons = db.collection<AppointmentAddon>(ADDONS_COLLECTION_NAME);
    const options = db.collection<AppointmentOption>(OPTIONS_COLLECTION_NAME);
    await addons.updateMany(
      {},
      {
        $pull: {
          fields: {
            id,
          },
        },
      }
    );

    await options.updateMany(
      {},
      {
        $pull: {
          fields: {
            id,
          },
        },
      }
    );

    return field;
  }

  public async deleteFields(ids: string[]): Promise<void> {
    const db = await getDbConnection();
    const fields = db.collection<ServiceField>(FIELDS_COLLECTION_NAME);

    await fields.deleteMany({
      _id: {
        $in: ids,
      },
    });

    const addons = db.collection<AppointmentAddon>(ADDONS_COLLECTION_NAME);
    const options = db.collection<AppointmentOption>(OPTIONS_COLLECTION_NAME);
    await addons.updateMany(
      {},
      {
        $pull: {
          fields: {
            id: {
              $in: ids,
            },
          },
        },
      }
    );

    await options.updateMany(
      {},
      {
        $pull: {
          fields: {
            id: {
              $in: ids,
            },
          },
        },
      }
    );
  }

  public async checkFieldUniqueName(
    name: string,
    id?: string
  ): Promise<boolean> {
    const db = await getDbConnection();
    const fields = db.collection<ServiceField>(FIELDS_COLLECTION_NAME);

    const filter: Filter<ServiceField> = {
      name,
    };

    if (id) {
      filter._id = {
        $ne: id,
      };
    }

    const result = await fields.countDocuments(filter);
    return result === 0;
  }

  /** Addons */

  public async getAddon(id: string): Promise<AppointmentAddon | null> {
    const db = await getDbConnection();
    const addons = db.collection<AppointmentAddon>(ADDONS_COLLECTION_NAME);

    const addon = await addons.findOne({
      _id: id,
    });

    return addon;
  }

  public async getAddonsById(ids: string[]): Promise<AppointmentAddon[]> {
    const db = await getDbConnection();
    const addons = db.collection<AppointmentAddon>(ADDONS_COLLECTION_NAME);

    return await addons
      .find({
        _id: {
          $in: ids,
        },
      })
      .toArray();
  }

  public async getAddons<T extends boolean | undefined>(
    query: Query,
    includeUsage?: T
  ): Promise<WithTotal<AddonsType<T>>> {
    const db = await getDbConnection();

    const sort: Sort = query.sort?.reduce(
      (prev, curr) => ({
        ...prev,
        [curr.id]: curr.desc ? -1 : 1,
      }),
      {}
    ) || { updatedAt: -1 };

    const filter: Filter<AppointmentAddon> = {};

    if (query.search) {
      const $regex = new RegExp(escapeRegex(query.search), "i");
      const queries = buildSearchQuery<AppointmentAddon>(
        { $regex },
        "name",
        "duration",
        "price",
        "description"
      );

      filter.$or = queries;
    }

    const [result] = await db
      .collection<AppointmentAddon>(ADDONS_COLLECTION_NAME)
      .aggregate([
        {
          $sort: sort,
        },
        {
          $match: filter,
        },
        ...(includeUsage
          ? [
              {
                $lookup: {
                  from: OPTIONS_COLLECTION_NAME,
                  localField: "_id",
                  foreignField: "addons.id",
                  pipeline: [
                    {
                      $project: {
                        _id: 1,
                        name: 1,
                      },
                    },
                  ],
                  as: "options",
                },
              },
            ]
          : []),
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

  public async createAddon(
    addon: AppointmentAddonUpdateModel
  ): Promise<AppointmentAddon> {
    const dbAddon: AppointmentAddon = {
      ...addon,
      _id: new ObjectId().toString(),
      updatedAt: DateTime.utc().toJSDate(),
    };

    if (!this.checkAddonUniqueName(addon.name)) {
      throw new Error("Name already exists");
    }

    const db = await getDbConnection();
    const addons = db.collection<AppointmentAddon>(ADDONS_COLLECTION_NAME);

    await addons.insertOne(dbAddon);

    return dbAddon;
  }

  public async updateAddon(
    id: string,
    update: AppointmentAddonUpdateModel
  ): Promise<void> {
    const db = await getDbConnection();
    const addons = db.collection<AppointmentAddon>(ADDONS_COLLECTION_NAME);

    const { _id, ...updateObj } = update as AppointmentAddon; // Remove fields in case it slips here

    if (!this.checkAddonUniqueName(update.name, id)) {
      throw new Error("Name already exists");
    }

    updateObj.updatedAt = DateTime.utc().toJSDate();

    await addons.updateOne(
      {
        _id: id,
      },
      {
        $set: updateObj,
      }
    );
  }

  public async deleteAddon(id: string): Promise<AppointmentAddon | null> {
    const db = await getDbConnection();
    const addons = db.collection<AppointmentAddon>(ADDONS_COLLECTION_NAME);

    const addon = await addons.findOne({ _id: id });
    if (!addon) return null;

    await addons.deleteOne({
      _id: id,
    });

    const options = db.collection<AppointmentOption>(OPTIONS_COLLECTION_NAME);
    await options.updateMany(
      {},
      {
        $pull: {
          addons: {
            id,
          },
        },
      }
    );

    return addon;
  }

  public async deleteAddons(ids: string[]): Promise<void> {
    const db = await getDbConnection();
    const addons = db.collection<AppointmentAddon>(ADDONS_COLLECTION_NAME);

    await addons.deleteMany({
      _id: {
        $in: ids,
      },
    });

    const options = db.collection<AppointmentOption>(OPTIONS_COLLECTION_NAME);
    await options.updateMany(
      {},
      {
        $pull: {
          addons: {
            id: {
              $in: ids,
            },
          },
        },
      }
    );
  }

  public async checkAddonUniqueName(
    name: string,
    id?: string
  ): Promise<boolean> {
    const db = await getDbConnection();
    const addons = db.collection<AppointmentAddon>(ADDONS_COLLECTION_NAME);

    const filter: Filter<AppointmentAddon> = {
      name,
    };

    if (id) {
      filter._id = {
        $ne: id,
      };
    }

    const result = await addons.countDocuments(filter);
    return result === 0;
  }

  /** Options */

  public async getOption(id: string): Promise<AppointmentOption | null> {
    const db = await getDbConnection();
    const options = db.collection<AppointmentOption>(OPTIONS_COLLECTION_NAME);

    const option = await options.findOne({
      _id: id,
    });

    return option;
  }

  public async getOptions(query: Query): Promise<WithTotal<AppointmentOption>> {
    const db = await getDbConnection();

    const sort: Sort = query.sort?.reduce(
      (prev, curr) => ({
        ...prev,
        [curr.id]: curr.desc ? -1 : 1,
      }),
      {}
    ) || { updatedAt: -1 };

    const filter: Filter<AppointmentOption> = {};

    if (query.search) {
      const $regex = new RegExp(escapeRegex(query.search), "i");
      const queries = buildSearchQuery<AppointmentOption>(
        { $regex },
        "name",
        "duration",
        "price",
        "description"
      );

      filter.$or = queries;
    }

    const [result] = await db
      .collection<AppointmentOption>(OPTIONS_COLLECTION_NAME)
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

  public async createOption(
    addon: AppointmentOptionUpdateModel
  ): Promise<AppointmentOption> {
    const dbOption: AppointmentOption = {
      ...addon,
      _id: new ObjectId().toString(),
      updatedAt: DateTime.utc().toJSDate(),
    };

    if (!this.checkOptionUniqueName(addon.name)) {
      throw new Error("Name already exists");
    }

    const db = await getDbConnection();
    const options = db.collection<AppointmentOption>(OPTIONS_COLLECTION_NAME);

    await options.insertOne(dbOption);

    return dbOption;
  }

  public async updateOption(
    id: string,
    update: AppointmentOptionUpdateModel
  ): Promise<void> {
    const db = await getDbConnection();
    const options = db.collection<AppointmentOption>(OPTIONS_COLLECTION_NAME);

    const { _id, ...updateObj } = update as AppointmentOption; // Remove fields in case it slips here

    if (!this.checkOptionUniqueName(update.name, id)) {
      throw new Error("Name already exists");
    }

    updateObj.updatedAt = DateTime.utc().toJSDate();

    await options.updateOne(
      {
        _id: id,
      },
      {
        $set: updateObj,
      }
    );
  }

  public async deleteOption(id: string): Promise<AppointmentOption | null> {
    const db = await getDbConnection();
    const options = db.collection<AppointmentOption>(OPTIONS_COLLECTION_NAME);

    const option = await options.findOne({ _id: id });
    if (!option) return null;

    await options.deleteOne({
      _id: id,
    });

    const configurations = db.collection<ConfigurationOption<"booking">>(
      CONFIGURATION_COLLECTION_NAME
    );
    await configurations.updateOne(
      {
        key: "booking",
      },
      {
        $pull: {
          "value.options": {
            id,
          },
        },
      }
    );

    return option;
  }

  public async deleteOptions(ids: string[]): Promise<void> {
    const db = await getDbConnection();
    const options = db.collection<AppointmentOption>(OPTIONS_COLLECTION_NAME);

    await options.deleteMany({
      _id: {
        $in: ids,
      },
    });

    const configurations = db.collection<ConfigurationOption<"booking">>(
      CONFIGURATION_COLLECTION_NAME
    );

    await configurations.updateOne(
      {
        key: "booking",
      },
      {
        $pull: {
          "value.options": {
            id: {
              $in: ids,
            },
          },
        },
      }
    );
  }

  public async checkOptionUniqueName(
    name: string,
    id?: string
  ): Promise<boolean> {
    const db = await getDbConnection();
    const options = db.collection<AppointmentOption>(OPTIONS_COLLECTION_NAME);

    const filter: Filter<AppointmentOption> = {
      name,
    };

    if (id) {
      filter._id = {
        $ne: id,
      };
    }

    const result = await options.countDocuments(filter);
    return result === 0;
  }
}
