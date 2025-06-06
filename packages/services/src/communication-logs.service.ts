import {
  CommunicationChannel,
  CommunicationDirection,
  CommunicationLog,
  CommunicationLogEntity,
  CommunicationParticipantType,
  DateRange,
  ICommunicationLogsService,
  Query,
  WithTotal,
} from "@vivid/types";
import { buildSearchQuery, escapeRegex } from "@vivid/utils";
import { Filter, ObjectId, Sort } from "mongodb";
import { CUSTOMERS_COLLECTION_NAME } from "./customers.service";
import { getDbConnection } from "./database";
import { APPOINTMENTS_COLLECTION_NAME } from "./events.service";

export const LOG_COLLECTION_NAME = "communication-logs";

export class CommunicationLogsService implements ICommunicationLogsService {
  public async log(log: Omit<CommunicationLogEntity, "dateTime" | "_id">) {
    const db = await getDbConnection();
    const collection =
      db.collection<CommunicationLogEntity>(LOG_COLLECTION_NAME);

    await collection.insertOne({
      ...log,
      dateTime: new Date(),
      _id: new ObjectId().toString(),
    });
  }

  public async getCommunicationLogs(
    query: Query & {
      direction?: CommunicationDirection[];
      channel?: CommunicationChannel[];
      participantType?: CommunicationParticipantType[];
      range?: DateRange;
      customerId?: string | string[];
      appointmentId?: string;
    }
  ): Promise<WithTotal<CommunicationLog>> {
    const db = await getDbConnection();

    const sort: Sort = query.sort?.reduce(
      (prev, curr) => ({
        ...prev,
        [curr.id]: curr.desc ? -1 : 1,
      }),
      {}
    ) || { dateTime: -1 };

    const filter: Filter<CommunicationLog> = {};

    if (query.range?.start || query.range?.end) {
      filter.dateTime = {};

      if (query.range.start) {
        filter.dateTime.$gte = query.range.start;
      }

      if (query.range.end) {
        filter.dateTime.$lte = query.range.end;
      }
    }

    if (query.direction && query.direction.length) {
      filter.direction = {
        $in: query.direction,
      };
    }

    if (query.channel && query.channel.length) {
      filter.channel = {
        $in: query.channel,
      };
    }

    if (query.participantType && query.participantType.length) {
      filter.participantType = {
        $in: query.participantType,
      };
    }

    if (query.appointmentId) {
      filter.appointmentId = query.appointmentId;
    } else if (query.customerId) {
      filter["customer._id"] = {
        $in: Array.isArray(query.customerId)
          ? query.customerId
          : [query.customerId],
      };
    }

    if (query.search) {
      const $regex = new RegExp(escapeRegex(query.search), "i");
      const queries = buildSearchQuery<CommunicationLog>(
        { $regex },
        "channel",
        "participant",
        "handledBy",
        "text",
        "appointment.option.name",
        "customer.name",
        "subject"
      );

      filter.$or = queries;
    }

    const [result] = await db
      .collection<CommunicationLogEntity>(LOG_COLLECTION_NAME)
      .aggregate([
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

  public async clearAllLogs() {
    const db = await getDbConnection();
    const collection = db.collection<CommunicationLog>(LOG_COLLECTION_NAME);

    await collection.deleteMany();
  }

  public async clearSelectedLogs(ids: string[]) {
    const db = await getDbConnection();
    const collection = db.collection<CommunicationLog>(LOG_COLLECTION_NAME);

    await collection.deleteMany({
      _id: {
        $in: ids,
      },
    });
  }

  public async clearOldLogs(maxDate: Date) {
    const db = await getDbConnection();
    const collection = db.collection<CommunicationLog>(LOG_COLLECTION_NAME);

    await collection.deleteMany({
      dateTime: {
        $lt: maxDate,
      },
    });
  }
}
