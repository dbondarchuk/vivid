import { getDbConnection } from "@/database";
import { buildSearchQuery } from "@/lib/query";
import type {
  AppointmentEvent,
  AppointmentStatus,
  DateRange,
  Event,
  Period,
  WithTotal,
} from "@/types";
import { Appointment } from "@/types";
import { Query } from "@/types/database/query";
import { DateTime } from "luxon";
import { Filter, ObjectId, Sort } from "mongodb";
import { ConfigurationService } from "./configurationService";
import { getIcsEventUid, IcsBusyTimeProvider } from "./helpers/ics";
import { NotificationService } from "./notifications/notificationService";

const APPOINTMENTS_COLLECTION_NAME = "appointments";

export class EventsService {
  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly notificationService: NotificationService
  ) {}

  public async getBusyEvents(): Promise<Period[]> {
    const config = await this.configurationService.getConfiguration("booking");
    const { url } = await this.configurationService.getConfiguration("general");

    const start = DateTime.utc();
    const end = DateTime.utc().plus({ weeks: config.maxWeeksInFuture ?? 8 });

    const declinedUids = (await this.getDbDeclinedEventIds(start, end)).map(
      (id) => getIcsEventUid(id, url)
    );

    const dbEventsPromise = this.getDbBusyTimes(start, end);

    const ics = new IcsBusyTimeProvider(config.ics);
    const icsEventsPromise = ics.getBusyTimes(start, end, declinedUids);

    const [dbEvents, icsEvents] = await Promise.all([
      dbEventsPromise,
      icsEventsPromise,
    ]);

    return [...dbEvents, ...icsEvents];
  }

  public async createEvent(
    event: AppointmentEvent,
    status: AppointmentStatus = "pending"
  ): Promise<Appointment> {
    const appointment = await this.saveEvent(event, status);

    await this.notificationService.sendAppointmentRequestedNotification(
      appointment
    );

    if (status === "confirmed") {
      await this.notificationService.sendAppointmentConfirmedNotification(
        appointment
      );
    }

    return appointment;
  }

  public async getPendingAppointments(
    limit = 20,
    after?: Date
  ): Promise<WithTotal<Appointment>> {
    const db = await getDbConnection();
    const filter: Filter<Appointment> = {
      status: "pending",
      dateTime: after
        ? {
            $gte: after,
          }
        : undefined,
    };

    const collection = db.collection<Appointment>(APPOINTMENTS_COLLECTION_NAME);

    const total = await collection.countDocuments(filter);
    if (limit === 0) {
      return {
        items: [],
        total,
      };
    }

    const appointments = await collection.find(filter).limit(limit).toArray();

    return {
      items: appointments,
      total,
    };
  }

  public async getNextAppointments(date: Date, limit = 5) {
    const db = await getDbConnection();
    const appointments = db.collection<Appointment>(
      APPOINTMENTS_COLLECTION_NAME
    );

    const result = await appointments
      .find({
        dateTime: {
          $gte: date,
        },
        status: {
          $ne: "declined",
        },
      })
      .sort("dateTime", "ascending")
      .limit(limit)
      .toArray();

    return result;
  }

  public async getAppointments(
    query: Query & {
      range?: DateRange;
      status?: AppointmentStatus[];
    }
  ): Promise<WithTotal<Appointment>> {
    const db = await getDbConnection();

    const sort: Sort = query.sort?.reduce(
      (prev, curr) => ({
        ...prev,
        [curr.key]: curr.desc ? -1 : 1,
      }),
      {}
    ) || { dateTime: 1 };

    const filter: Filter<Appointment> = {};
    if (query.range?.start || query.range?.end) {
      filter.dateTime = {};

      if (query.range.start) {
        filter.dateTime.$gte = query.range.start;
      }

      if (query.range.end) {
        filter.dateTime.$lte = query.range.end;
      }
    }

    if (query.status && query.status.length) {
      filter.status = {
        $in: query.status,
      };
    }

    if (query.search) {
      const $regex = new RegExp(query.search, "i");
      const queries = buildSearchQuery<Appointment>(
        { $regex },
        "option.name",
        "option.description",
        "note",
        "addons.name",
        "addons.description",
        "fields.v"
      );

      filter.$or = queries;
    }

    const [result] = await db
      .collection<Appointment>(APPOINTMENTS_COLLECTION_NAME)
      .aggregate([
        {
          $addFields: {
            fields: {
              $objectToArray: "$fields",
            },
          },
        },
        {
          $sort: sort,
        },
        {
          $match: filter,
        },
        {
          $addFields: {
            fields: {
              $arrayToObject: "$fields",
            },
          },
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

  public async getEvents(
    start: Date,
    end: Date,
    status: AppointmentStatus[]
  ): Promise<Event[]> {
    const appointments = await this.getAppointments({
      range: {
        start,
        end,
      },
      status,
    });

    const config = await this.configurationService.getConfiguration("booking");
    const { url } = await this.configurationService.getConfiguration("general");

    const ics = new IcsBusyTimeProvider(config.ics);
    const icsTimes = await ics.getBusyTimes(
      DateTime.fromJSDate(start),
      DateTime.fromJSDate(end),
      appointments.items.map((app) => getIcsEventUid(app._id, url))
    );

    const icsEvents: Event[] = icsTimes.map((x) => ({
      title: x.title || "Busy",
      dateTime: x.startAt.toJSDate(),
      totalDuration: x.endAt.diff(x.startAt, "minutes").minutes,
      uid: x.uid,
    }));

    return [...appointments.items, ...icsEvents];
  }

  public async getAppointment(id: string) {
    const db = await getDbConnection();
    const appointments = db.collection<Appointment>(
      APPOINTMENTS_COLLECTION_NAME
    );

    const result = await appointments.findOne({
      _id: id,
    });

    return result;
  }

  public async changeAppointmentStatus(
    id: string,
    newStatus: AppointmentStatus
  ) {
    const db = await getDbConnection();

    const appointment = await db
      .collection<Appointment>(APPOINTMENTS_COLLECTION_NAME)
      .findOne({
        _id: id,
      });

    if (!appointment) return;

    await db.collection<Appointment>(APPOINTMENTS_COLLECTION_NAME).updateOne(
      {
        _id: id,
      },
      {
        $set: {
          status: newStatus,
        },
      }
    );

    switch (newStatus) {
      case "declined":
        this.notificationService.sendAppointmentDeclinedNotification(
          appointment
        );

        break;

      case "confirmed":
        this.notificationService.sendAppointmentConfirmedNotification(
          appointment
        );

        break;
    }
  }

  public async updateAppointmentNote(id: string, note?: string) {
    const db = await getDbConnection();

    await db.collection<Appointment>(APPOINTMENTS_COLLECTION_NAME).updateOne(
      {
        _id: id,
      },
      {
        $set: {
          note: note,
        },
      }
    );
  }

  public async rescheduleAppointment(
    id: string,
    newTime: Date,
    newDuration: number
  ) {
    const db = await getDbConnection();

    const appointment = await db
      .collection<Appointment>(APPOINTMENTS_COLLECTION_NAME)
      .findOne({
        _id: id,
      });

    if (!appointment) return;

    await db.collection<Appointment>(APPOINTMENTS_COLLECTION_NAME).updateOne(
      {
        _id: id,
      },
      {
        $set: {
          dateTime: newTime,
          totalDuration: newDuration,
        },
      }
    );

    await this.notificationService.sendAppointmentRescheduledNotification(
      appointment,
      newTime,
      newDuration
    );
  }

  private async getDbBusyTimes(
    start: DateTime,
    end: DateTime
  ): Promise<Period[]> {
    const db = await getDbConnection();
    const events = await db
      .collection<Appointment>(APPOINTMENTS_COLLECTION_NAME)
      .find({
        dateTime: {
          $gte: start.minus({ days: 1 }).toJSDate(),
          $lte: end.plus({ days: 1 }).toJSDate(),
        },
        status: {
          $ne: "declined",
        },
      })
      .map(({ totalDuration: duration, dateTime }) => {
        return {
          duration,
          dateTime,
        };
      })
      .toArray();

    return events.map((x) => ({
      startAt: DateTime.fromJSDate(x.dateTime, { zone: "utc" }),
      endAt: DateTime.fromJSDate(x.dateTime, { zone: "utc" }).plus({
        minutes: x.duration,
      }),
    }));
  }

  private async getDbDeclinedEventIds(
    start: DateTime,
    end: DateTime
  ): Promise<string[]> {
    const db = await getDbConnection();
    const ids = await db
      .collection<Appointment>(APPOINTMENTS_COLLECTION_NAME)
      .find({
        dateTime: {
          $gte: start.minus({ days: 1 }).toJSDate(),
          $lte: end.plus({ days: 1 }).toJSDate(),
        },
        status: {
          $eq: "declined",
        },
      })
      .map(({ _id }) => _id)
      .toArray();

    return ids;
  }

  private async saveEvent(
    event: AppointmentEvent,
    status: AppointmentStatus = "pending"
  ) {
    const db = await getDbConnection();
    const appointments = db.collection<Appointment>(
      APPOINTMENTS_COLLECTION_NAME
    );

    const dbEvent: Appointment = {
      ...event,
      _id: new ObjectId().toString(),
      dateTime: DateTime.fromISO(event.dateTime, { zone: "utc" }).toJSDate(),
      status,
      createdAt: DateTime.now().toJSDate(),
    };

    await appointments.insertOne(dbEvent);

    return dbEvent;
  }
}
