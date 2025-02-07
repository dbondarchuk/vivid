import {
  CommunicationChannel,
  CommunicationDirection,
  CommunicationLog,
  DateRange,
  ICommunicationLogService,
  Query,
  WithTotal,
} from "@vivid/types";
import { buildSearchQuery } from "@vivid/utils";
import { Filter, ObjectId, Sort } from "mongodb";
import { getDbConnection } from "./database";

export const LOG_COLLECTION_NAME = "communication-logs";

export class CommunicationLogService implements ICommunicationLogService {
  public async log(log: Omit<CommunicationLog, "dateTime" | "_id">) {
    const db = await getDbConnection();
    const collection = db.collection<CommunicationLog>(LOG_COLLECTION_NAME);

    await collection.insertOne({
      ...log,
      dateTime: new Date(),
      _id: new ObjectId().toString(),
    });
  }

  public async getCommunicationLogs(
    query: Query & {
      direction: CommunicationDirection[];
      channel: CommunicationChannel[];
      range?: DateRange;
    }
  ): Promise<WithTotal<CommunicationLog>> {
    const db = await getDbConnection();

    const sort: Sort = query.sort?.reduce(
      (prev, curr) => ({
        ...prev,
        [curr.key]: curr.desc ? -1 : 1,
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

    if (query.search) {
      const $regex = new RegExp(query.search, "i");
      const queries = buildSearchQuery<CommunicationLog>(
        { $regex },
        "channel",
        "initiator",
        "receiver",
        "text",
        "appointmentId",
        "subject"
      );

      filter.$or = queries;
    }

    const [result] = await db
      .collection<CommunicationLog>(LOG_COLLECTION_NAME)
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
