import { getDbConnection } from "./database";

import { AvailableAppServices } from "@vivid/app-store/services";

import type {
  Appointment,
  AppointmentEvent,
  AppointmentStatus,
  Asset,
  Availability,
  BookingConfiguration,
  DateRange,
  DaySchedule,
  Event,
  GeneralConfiguration,
  IAppointmentHook,
  IAssetsService,
  ICalendarBusyTimeProvider,
  IConfigurationService,
  IConnectedAppsService,
  IEventsService,
  IScheduleService,
  Period,
  Query,
  WithTotal,
} from "@vivid/types";
import { buildSearchQuery, escapeRegex, parseTime } from "@vivid/utils";
import { getIcsEventUid } from "@vivid/utils/src/ics-uid";
import { getAvailableTimeSlotsInCalendar } from "@vivid/utils/src/time-slot";
import { DateTime } from "luxon";
import mimeType from "mime-type/with-db";
import { Filter, ObjectId, Sort } from "mongodb";
import { v4 } from "uuid";

const APPOINTMENTS_COLLECTION_NAME = "appointments";

export class EventsService implements IEventsService {
  constructor(
    private readonly configurationService: IConfigurationService,
    private readonly appsService: IConnectedAppsService,
    private readonly assetsService: IAssetsService,
    private readonly scheduleService: IScheduleService
  ) {}

  public async getAvailability(duration: number): Promise<Availability> {
    const config = await this.configurationService.getConfiguration("booking");

    const events = await this.getBusyEvents();

    const start = DateTime.now().plus({
      hours: config.minHoursBeforeBooking || 0,
    });

    const end = start.plus({ weeks: config.maxWeeksInFuture ?? 8 });

    const schedule = await this.scheduleService.getSchedule(
      start.toJSDate(),
      end.toJSDate()
    );

    return this.getAvailableTimes(
      start,
      end,
      duration,
      events,
      config,
      schedule
    );
  }

  public async getBusyEventsInTimeFrame(
    start: Date,
    end: Date
  ): Promise<Period[]> {
    const { booking: config, general: generalConfig } =
      await this.configurationService.getConfigurations("booking", "general");

    return await this.getBusyTimes(
      DateTime.fromJSDate(start),
      DateTime.fromJSDate(end),
      config,
      generalConfig
    );
  }

  public async getBusyEvents(): Promise<Period[]> {
    const { booking: config, general: generalConfig } =
      await this.configurationService.getConfigurations("booking", "general");

    const start = DateTime.utc();
    const end = DateTime.utc().plus({ weeks: config.maxWeeksInFuture ?? 8 });

    return await this.getBusyTimes(start, end, config, generalConfig);
  }

  public async createEvent({
    event,
    status = "pending",
    force = false,
    files,
  }: {
    event: AppointmentEvent;
    status?: AppointmentStatus;
    force?: boolean;
    files?: Record<string, File>;
  }): Promise<Appointment> {
    const { booking: config, general: generalConfig } =
      await this.configurationService.getConfigurations("booking", "general");

    if (!force) {
      const eventTime = DateTime.fromISO(event.dateTime, {
        zone: "utc",
      }).setZone(config.timezone);

      if (eventTime < DateTime.now()) {
        throw new Error("Time is not available");
      }

      const start = eventTime.startOf("day");
      const end = start.endOf("day");

      const events = await this.getBusyTimes(start, end, config, generalConfig);

      const schedule = await this.scheduleService.getSchedule(
        start.toJSDate(),
        end.toJSDate()
      );

      const availability = await this.getAvailableTimes(
        start,
        end,
        event.totalDuration,
        events,
        config,
        schedule
      );

      if (!availability.find((time) => time === eventTime.toMillis())) {
        throw new Error("Time is not available");
      }
    }

    const appointmentId = new ObjectId().toString();
    const assets: Asset[] = [];
    if (files) {
      for (const [fieldId, file] of Object.entries(files)) {
        let fileType = mimeType.lookup(file.name);
        if (!fileType) {
          fileType = "application/octet-stream";
        } else if (Array.isArray(fileType)) {
          fileType = fileType[0];
        }

        const buffer = await file.arrayBuffer();

        const asset = await this.assetsService.createAsset(
          {
            filename: `${appointmentId}-${fieldId}-${file.name}`,
            mimeType: fileType,
            appointmentId,
            description: `${event.fields.name} - ${event.option.name} - ${fieldId}`,
          },
          Buffer.from(buffer)
        );

        assets.push(asset);
      }
    }

    const appointment = await this.saveEvent(
      event,
      appointmentId,
      assets.length ? assets : undefined,
      status
    );

    const hooks =
      await this.appsService.getAppsByScopeWithData("appointment-hook");

    const promises = hooks.map(async (hook) => {
      const service = AvailableAppServices[hook.name](
        this.appsService.getAppServiceProps(hook._id)
      ) as any as IAppointmentHook;

      try {
        await service.onAppointmentCreated(hook, appointment);

        if (status === "confirmed") {
          await service.onAppointmentStatusChanged(
            hook,
            appointment,
            "confirmed"
          );
        }
      } catch (error: any) {
        console.error(
          `Hook ${hook.name}.onAppointmentCreatedonAppointmentStatusChanged has failed`,
          error
        );
      }
    });

    await Promise.all(promises);

    return appointment;
  }

  public async getPendingAppointmentsCount(after?: Date): Promise<number> {
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

    return await collection.countDocuments(filter);
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
        [curr.id]: curr.desc ? -1 : 1,
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

    const appsPromises = apps.map(async (app) => {
      const service = AvailableAppServices[app.name](
        this.appsService.getAppServiceProps(app._id)
      ) as any as ICalendarBusyTimeProvider;

      return await service.getBusyTimes(app, start, end);
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
    const oldStatus = appointment.status;

    if (oldStatus === newStatus) return;

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

    const hooks =
      await this.appsService.getAppsByScopeWithData("appointment-hook");

    const promises = hooks.map(async (hook) => {
      const service = AvailableAppServices[hook.name](
        this.appsService.getAppServiceProps(hook._id)
      ) as any as IAppointmentHook;

      try {
        return await service.onAppointmentStatusChanged(
          hook,
          appointment,
          newStatus,
          oldStatus
        );
      } catch (error: any) {
        console.error(
          `Hook ${hook.name}.onAppointmentStatusChanged has failed`,
          error
        );
      }
    });

    await Promise.all(promises);
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

  public async addAppointmentFiles(
    appointmentId: string,
    files: File[]
  ): Promise<Asset[]> {
    const db = await getDbConnection();
    const event = await db
      .collection<Appointment>(APPOINTMENTS_COLLECTION_NAME)
      .findOne({
        _id: appointmentId,
      });

    if (!event) {
      return [];
    }

    const assets: Asset[] = [];
    if (files) {
      for (const file of files) {
        let fileType = mimeType.lookup(file.name);
        if (!fileType) {
          fileType = "application/octet-stream";
        } else if (Array.isArray(fileType)) {
          fileType = fileType[0];
        }

        const buffer = await file.arrayBuffer();

        const id = v4();
        const asset = await this.assetsService.createAsset(
          {
            filename: `appointments/${appointmentId}/${id}-${file.name}`,
            mimeType: fileType,
            appointmentId,
            description: `${event.fields.name} - ${event.option.name}`,
          },
          Buffer.from(buffer)
        );

        assets.push(asset);
      }
    }

    await db.collection<Appointment>(APPOINTMENTS_COLLECTION_NAME).updateOne(
      {
        _id: appointmentId,
      },
      {
        $addToSet: {
          files: {
            $each: assets,
          },
        },
      }
    );

    return assets;
  }

  public async addAppointmentAsset(id: string, assetId: string): Promise<void> {
    const asset = await this.assetsService.getAsset(assetId);
    if (!asset) {
      throw new Error("Asset not found");
    }

    const db = await getDbConnection();
    await db.collection<Appointment>(APPOINTMENTS_COLLECTION_NAME).updateOne(
      {
        _id: id,
      },
      {
        $addToSet: {
          files: asset,
        },
      }
    );
  }

  public async removeAppointmentFiles(
    id: string,
    filesIds: string[]
  ): Promise<void> {
    const db = await getDbConnection();

    await db.collection<Appointment>(APPOINTMENTS_COLLECTION_NAME).updateOne(
      {
        _id: id,
      },
      {
        $pull: {
          files: {
            _id: {
              $in: filesIds,
            },
          },
        },
      }
    );

    await this.assetsService.deleteAssets(filesIds);
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
    const oldTime = appointment.dateTime;
    const oldDuration = appointment.totalDuration;

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

    const hooks =
      await this.appsService.getAppsByScopeWithData("appointment-hook");

    const promises = hooks.map(async (hook) => {
      const service = AvailableAppServices[hook.name](
        this.appsService.getAppServiceProps(hook._id)
      ) as any as IAppointmentHook;

      try {
        await service.onAppointmentRescheduled(
          hook,
          appointment,
          newTime,
          newDuration,
          oldTime,
          oldDuration
        );
      } catch (error: any) {
        console.error(
          `Hook ${hook.name}.onAppointmentRescheduled has failed`,
          error
        );
      }
    });

    await Promise.all(promises);
  }

  private async getAvailableTimes(
    start: DateTime,
    end: DateTime,
    duration: number,
    events: Period[],
    config: BookingConfiguration,
    schedule: Record<string, DaySchedule>
  ) {
    const customSlots = config.customSlotTimes?.map((x) => parseTime(x));
    const results = getAvailableTimeSlotsInCalendar({
      calendarEvents: events,
      configuration: {
        timeSlotDuration: duration,
        schedule,
        timeZone: config.timezone || DateTime.now().zoneName!,
        minAvailableTimeAfterSlot: config.minAvailableTimeAfterSlot ?? 0,
        minAvailableTimeBeforeSlot: config.minAvailableTimeBeforeSlot ?? 0,
        slotStart: config.slotStart ?? 15,
        customSlots,
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
    const appsPromises = apps.map(async (app) => {
      const service = AvailableAppServices[app.name](
        this.appsService.getAppServiceProps(app._id)
      ) as any as ICalendarBusyTimeProvider;

      return service.getBusyTimes(app, start.toJSDate(), end.toJSDate());
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
          }) satisfies Period
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
    id: string,
    files?: Asset[],
    status: AppointmentStatus = "pending"
  ) {
    const db = await getDbConnection();
    const appointments = db.collection<Appointment>(
      APPOINTMENTS_COLLECTION_NAME
    );

    const dbEvent: Appointment = {
      ...event,
      _id: id,
      dateTime: DateTime.fromISO(event.dateTime, { zone: "utc" }).toJSDate(),
      status,
      createdAt: DateTime.now().toJSDate(),
      files,
    };

    await appointments.insertOne(dbEvent);

    return dbEvent;
  }
}
