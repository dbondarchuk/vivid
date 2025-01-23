import { InstalledAppServices } from "@/apps/apps.services";
import { getDbConnection } from "@/database";
import { buildSearchQuery } from "@/lib/query";
import { escapeRegex } from "@/lib/string";
import type {
  AppointmentEvent,
  AppointmentStatus,
  Availability,
  BookingConfiguration,
  DateRange,
  Event,
  GeneralConfiguration,
  ICalendarBusyTimeProvider,
  Period,
  WithTotal,
} from "@/types";
import { Appointment } from "@/types";
import { Query } from "@/types/database/query";
import { DateTime } from "luxon";
import { Filter, ObjectId, Sort } from "mongodb";
import { ConfigurationService } from "./configurationService";
import { ConnectedAppService } from "./connectedAppService";
import { getIcsEventUid } from "./helpers/icsUid";
import { getAvailableTimeSlotsInCalendar } from "./helpers/timeSlot";
import { NotificationService } from "./notifications/notificationService";

const APPOINTMENTS_COLLECTION_NAME = "appointments";

export class EventsService {
  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly notificationService: NotificationService,
    private readonly appsService: ConnectedAppService
  ) {}

  public async getAvailability(duration: number): Promise<Availability> {
    const config = await this.configurationService.getConfiguration("booking");

    const events = await this.getBusyEvents();

    const start = DateTime.now().plus({
      hours: config.minHoursBeforeBooking || 0,
    });

    return this.getAvailableTimes(
      start,
      start.plus({ weeks: config.maxWeeksInFuture ?? 8 }),
      duration,
      events,
      config
    );
  }

  public async getBusyEventsInTimeFrame(
    start: DateTime,
    end: DateTime
  ): Promise<Period[]> {
    const { booking: config, general: generalConfig } =
      await this.configurationService.getConfigurations("booking", "general");

    return await this.getBusyTimes(start, end, config, generalConfig);
  }

  public async getBusyEvents(): Promise<Period[]> {
    const { booking: config, general: generalConfig } =
      await this.configurationService.getConfigurations("booking", "general");

    const start = DateTime.utc();
    const end = DateTime.utc().plus({ weeks: config.maxWeeksInFuture ?? 8 });

    return await this.getBusyTimes(start, end, config, generalConfig);
  }

  public async createEvent(
    event: AppointmentEvent,
    status: AppointmentStatus = "pending",
    force = false
  ): Promise<Appointment> {
    const { booking: config, general: generalConfig } =
      await this.configurationService.getConfigurations("booking", "general");

    if (!force) {
      const eventTime = DateTime.fromISO(event.dateTime, { zone: "utc" });
      const start = eventTime.startOf("day");
      const end = start.endOf("day");

      const events = await this.getBusyTimes(start, end, config, generalConfig);

      const availability = await this.getAvailableTimes(
        start,
        end,
        event.totalDuration,
        events,
        config
      );

      if (!availability.find((time) => time === eventTime.toMillis())) {
        throw new Error("Time is not available");
      }
    }

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

  // public async getNextAppointments(date: Date, limit = 5) {
  //   const db = await getDbConnection();
  //   const appointments = db.collection<Appointment>(
  //     APPOINTMENTS_COLLECTION_NAME
  //   );

  //   const result = await appointments
  //     .find({
  //       dateTime: {
  //         $gte: date,
  //       },
  //       status: {
  //         $ne: "declined",
  //       },
  //     })
  //     .sort("dateTime", "ascending")
  //     .limit(limit)
  //     .toArray();

  //   return result;
  // }

  // This requires upgrade of MongoDB to at least 5.0
  public async getNextAppointments(date: Date, limit = 5) {
    const db = await getDbConnection();
    const appointments = db.collection<Appointment>(
      APPOINTMENTS_COLLECTION_NAME
    );

    const result = await appointments
      .aggregate([
        {
          $addFields: {
            endAt: {
              $dateAdd: {
                startDate: "$dateTime",
                unit: "minute",
                amount: "$totalDuration",
              },
            },
          },
        },
        {
          $sort: {
            dateTime: 1,
          },
        },
        {
          $match: {
            endAt: {
              $gte: date,
            },
            status: {
              $ne: "declined",
            },
          },
        },
        { $limit: limit },
      ])
      .toArray();

    return result as Appointment[];
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
    ) || { dateTime: -1 };

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
      const $regex = new RegExp(escapeRegex(query.search), "i");
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

    const { booking: config, general: generalConfig } =
      await this.configurationService.getConfigurations("booking", "general");

    const apps = await this.appsService.getAppsData(
      config.calendarSources?.map((source) => source.appId) || []
    );

    const skipUids = new Set(
      appointments.items.map((app) =>
        getIcsEventUid(app._id, generalConfig.url)
      )
    );

    const appsPromises = apps.map((app) => {
      const service = InstalledAppServices[app.name](
        this.appsService.getAppServiceProps(app._id)
      ) as unknown as ICalendarBusyTimeProvider;
      return service.getBusyTimes(
        app,
        DateTime.fromJSDate(start),
        DateTime.fromJSDate(end)
      );
    });

    const appsResponse = await Promise.all(appsPromises);
    const appsEvents: Event[] = appsResponse
      .flat()
      .map((event) => ({
        title: event.title || "Busy",
        dateTime: event.startAt.toJSDate(),
        totalDuration: event.endAt.diff(event.startAt, "minutes").minutes,
        uid: event.uid,
      }))
      .filter((event) => !skipUids.has(event.uid));

    return [...appointments.items, ...appsEvents];
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

  private async getAvailableTimes(
    start: DateTime,
    end: DateTime,
    duration: number,
    events: Period[],
    config: BookingConfiguration
  ) {
    const results = getAvailableTimeSlotsInCalendar({
      calendarEvents: events,
      configuration: {
        timeSlotDuration: duration,
        availablePeriods: config.workHours,
        timeZone: config.timezone || DateTime.now().zoneName!,
        minAvailableTimeAfterSlot: config.minAvailableTimeAfterSlot ?? 0,
        minAvailableTimeBeforeSlot: config.minAvailableTimeBeforeSlot ?? 0,
        slotStartMinuteStep: config.slotStartMinuteStep ?? 15,
      },
      from: start.toJSDate(),
      to: end.toJSDate(),
    });

    return results.map((x) => x.startAt);
  }

  private async getBusyTimes(
    start: DateTime,
    end: DateTime,
    config: BookingConfiguration,
    generalConfig: GeneralConfiguration
  ) {
    const declinedAppointments = await this.getDbDeclinedEventIds(start, end);
    const declinedUids = new Set(
      declinedAppointments.map((id) => getIcsEventUid(id, generalConfig.url))
    );

    const apps = await this.appsService.getAppsData(
      config.calendarSources?.map((source) => source.appId) || []
    );

    const dbEventsPromise = this.getDbBusyTimes(start, end);
    const appsPromises = apps.map((app) => {
      const service = InstalledAppServices[app.name](
        this.appsService.getAppServiceProps(app._id)
      ) as unknown as ICalendarBusyTimeProvider;
      return service.getBusyTimes(app, start, end);
    });

    const [dbEvents, ...appsEvents] = await Promise.all([
      dbEventsPromise,
      ...appsPromises,
    ]);

    const remoteEvents = appsEvents
      .flat()
      .filter((event) => !declinedUids.has(event.uid))
      .map(
        (event) =>
          ({
            startAt: event.startAt,
            endAt: event.endAt,
          } satisfies Period)
      );

    return [...dbEvents, ...remoteEvents];
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
