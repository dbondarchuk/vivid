import {
  Appointment,
  Customer,
  CustomerListModel,
  CustomerSearchField,
  CustomerUpdateModel,
  Query,
  WithTotal,
  type ICustomersService,
} from "@vivid/types";
import { buildSearchQuery, escapeRegex, Leaves } from "@vivid/utils";
import { Filter, ObjectId, Sort } from "mongodb";
import { getDbConnection } from "./database";
import { APPOINTMENTS_COLLECTION_NAME } from "./events.service";

export const CUSTOMERS_COLLECTION_NAME = "customers";

export class CustomersService implements ICustomersService {
  public async getCustomer(id: string): Promise<Customer | null> {
    const db = await getDbConnection();

    const collection = db.collection<Customer>(CUSTOMERS_COLLECTION_NAME);

    return await collection.findOne({
      _id: id,
    });
  }

  public async getCustomers(
    query: Query & { priorityIds?: string[] }
  ): Promise<WithTotal<CustomerListModel>> {
    const db = await getDbConnection();

    const sort: Sort = query.sort?.reduce(
      (prev, curr) => ({
        ...prev,
        [curr.id]: curr.desc ? -1 : 1,
      }),
      {}
    ) || { "lastAppointment.dateTime": -1 };

    const filter: Filter<Customer> = {};

    if (query.search) {
      const $regex = new RegExp(escapeRegex(query.search), "i");
      const queries = buildSearchQuery<Customer>(
        { $regex },
        "name",
        "phone",
        "email",
        "knownNames",
        "knownEmails",
        "knownPhones",
        "note"
      );

      filter.$or = queries;
    }

    const priorityStages = query.priorityIds
      ? [
          {
            $facet: {
              priority: [
                {
                  $match: {
                    _id: {
                      $in: query.priorityIds,
                    },
                  },
                },
              ],
              other: [
                {
                  $match: {
                    ...filter,
                    _id: {
                      $nin: query.priorityIds,
                    },
                  },
                },
                {
                  $sort: sort,
                },
              ],
            },
          },
          {
            $project: {
              values: {
                $concatArrays: ["$priority", "$other"],
              },
            },
          },
          {
            $unwind: {
              path: "$values",
            },
          },
          {
            $replaceRoot: {
              newRoot: "$values",
            },
          },
        ]
      : [
          {
            $match: filter,
          },
          {
            $sort: sort,
          },
        ];

    const [result] = await db
      .collection<Customer>(CUSTOMERS_COLLECTION_NAME)
      .aggregate([
        {
          $lookup: {
            from: APPOINTMENTS_COLLECTION_NAME,
            localField: "_id",
            foreignField: "customerId",
            as: "appointments",
          },
        },
        {
          $addFields: {
            appointmentsCount: {
              $size: "$appointments",
            },
            lastAppointment: {
              //   $getField: {
              //     field: "dateTime",
              //     input: {
              $first: {
                $filter: {
                  input: {
                    $sortArray: {
                      input: "$appointments",
                      sortBy: {
                        dateTime: -1,
                      },
                    },
                  },
                  as: "appt",
                  cond: {
                    $lt: ["$$appt.dateTime", new Date()],
                  },
                  limit: 1,
                },
              },
              // },
              //   },
            },
            nextAppointment: {
              //   $getField: {
              //     field: "dateTime",
              //     input: {
              $first: {
                $filter: {
                  input: {
                    $sortArray: {
                      input: "$appointments",
                      sortBy: {
                        dateTime: 1,
                      },
                    },
                  },
                  as: "appt",
                  cond: {
                    $gte: ["$$appt.dateTime", new Date()],
                  },
                  limit: 1,
                },
              },
              // },
              //   },
            },
          },
        },
        {
          $project: {
            appointments: 0,
          },
        },
        ...priorityStages,
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

  public async findCustomer(
    field: CustomerSearchField,
    search: string
  ): Promise<Customer | null> {
    const db = await getDbConnection();

    const collection = db.collection<Customer>(CUSTOMERS_COLLECTION_NAME);
    const $regex = new RegExp(escapeRegex(search), "i");
    const queries = buildSearchQuery<Customer>(
      { $regex },
      field,
      `known${field[0].toUpperCase()}${field.substring(1)}s` as Leaves<Customer>
    );

    return await collection.findOne({
      $or: queries,
    });
  }

  public async createCustomer(customer: CustomerUpdateModel): Promise<string> {
    const id = new ObjectId().toString();
    const db = await getDbConnection();

    const collection = db.collection<Customer>(CUSTOMERS_COLLECTION_NAME);

    await collection.insertOne({
      ...customer,
      _id: id,
    });

    return id;
  }

  public async updateCustomer(
    id: string,
    update: CustomerUpdateModel
  ): Promise<void> {
    const db = await getDbConnection();

    const collection = db.collection<Customer>(CUSTOMERS_COLLECTION_NAME);

    const { _id: _, ...updateObj } = update as Customer; // Remove fields in case it slips here

    await collection.updateOne(
      {
        _id: id,
      },
      {
        $set: updateObj,
      }
    );
  }

  public async deleteCustomer(id: string): Promise<Customer | null> {
    const db = await getDbConnection();

    const collection = db.collection<Customer>(CUSTOMERS_COLLECTION_NAME);

    const customer = collection.findOne({ _id: id });
    if (!customer) return null;

    const appointmentsCollection = db.collection<Appointment>(
      APPOINTMENTS_COLLECTION_NAME
    );
    const count = await appointmentsCollection.countDocuments({
      customerId: id,
    });

    if (count > 0) {
      throw new Error("Customer has existing appointments");
    }

    await collection.deleteOne({
      _id: id,
    });

    return customer;
  }

  public async deleteCustomers(ids: string[]): Promise<void> {
    const db = await getDbConnection();

    const collection = db.collection<Customer>(CUSTOMERS_COLLECTION_NAME);
    const appointmentsCollection = db.collection<Appointment>(
      APPOINTMENTS_COLLECTION_NAME
    );

    const appointmentMap = (await appointmentsCollection
      .aggregate([
        {
          $match: {
            customerId: {
              $in: ids,
            },
          },
        },
        {
          $group: {
            _id: "$customerId",
            count: {
              $count: {},
            },
          },
        },
      ])
      .toArray()) as { _id: string; count: number }[];

    const nonEmptyCustomers = appointmentMap.filter(({ count }) => count > 0);
    if (nonEmptyCustomers.length > 0) {
      throw new Error(
        `Some customers already have appointments: ${nonEmptyCustomers.map(({ _id }) => _id).join(", ")}`
      );
    }

    await collection.deleteMany({
      _id: {
        $in: ids,
      },
    });
  }

  public async mergeCustomers(
    targetId: string,
    valueIds: string[]
  ): Promise<void> {
    const db = await getDbConnection();
    const collection = db.collection<Customer>(CUSTOMERS_COLLECTION_NAME);

    const target = await collection.findOne({
      _id: targetId,
    });

    if (!target) {
      throw new Error(`Can't find target customer with id ${targetId}`);
    }

    if (!valueIds?.length) {
      throw new Error("IDs list should not be empty");
    }

    const ids = valueIds.filter((id) => id !== targetId);

    const customers = await collection
      .find({
        _id: {
          $in: ids,
        },
      })
      .toArray();

    if (customers.length !== ids.length) {
      throw new Error(`Could not find all customers for merge`);
    }

    const nameSet = new Set([target.name, ...target.knownNames]);
    const emailSet = new Set([target.email, ...target.knownEmails]);
    const phoneSet = new Set([target.phone, ...target.knownPhones]);

    const notes = new Set([target.note]);

    let avatar = target.avatar;
    let dateOfBirth = target.dateOfBirth;

    for (const customer of customers) {
      nameSet.add(customer.name);
      customer.knownNames.forEach((name) => nameSet.add(name));
      phoneSet.add(customer.phone);
      customer.knownPhones.forEach((phone) => phoneSet.add(phone));
      emailSet.add(customer.email);
      customer.knownEmails.forEach((email) => emailSet.add(email));

      notes.add(customer.note);
      if (!avatar && customer.avatar) avatar = customer.avatar;
      if (!dateOfBirth && customer.dateOfBirth)
        dateOfBirth = customer.dateOfBirth;
    }

    const [name, ...knownNames] = Array.from(nameSet);
    const [email, ...knownEmails] = Array.from(emailSet);
    const [phone, ...knownPhones] = Array.from(phoneSet);

    const note = Array.from(notes)
      .filter((n) => !!n)
      .join("\n\n-----\n\n");

    const update: CustomerUpdateModel = {
      name,
      email,
      phone,
      knownEmails,
      knownNames,
      knownPhones,
      note,
      avatar,
      dateOfBirth,
    };

    await collection.updateOne(
      {
        _id: targetId,
      },
      {
        $set: update,
      }
    );

    const appointmentsCollection = db.collection<Appointment>(
      APPOINTMENTS_COLLECTION_NAME
    );
    await appointmentsCollection.updateMany(
      {
        customerId: {
          $in: ids,
        },
      },
      {
        $set: {
          customerId: targetId,
        },
      }
    );

    await collection.deleteMany({
      _id: {
        $in: ids,
      },
    });
  }

  public async checkUniqueEmailAndPhone(
    emails: string[],
    phones: string[],
    id?: string
  ): Promise<{ email: boolean; phone: boolean }> {
    const db = await getDbConnection();
    const customers = db.collection<Customer>(CUSTOMERS_COLLECTION_NAME);

    const emailFilter: Filter<Customer> = {
      $or: [
        {
          email: { $in: emails },
        },

        {
          knownEmails: {
            $in: emails,
          },
        },
      ],
    };

    const phoneFilter: Filter<Customer> = {
      $or: [
        {
          phone: { $in: phones },
        },

        {
          knownPhones: {
            $in: phones,
          },
        },
      ],
    };

    if (id) {
      emailFilter._id = {
        $ne: id,
      };
      phoneFilter._id = {
        $ne: id,
      };
    }

    const [emailResult, phoneResult] = await Promise.all([
      customers.find(emailFilter).hasNext(),
      customers.find(phoneFilter).hasNext(),
    ]);

    return { email: !emailResult, phone: !phoneResult };
  }
}
