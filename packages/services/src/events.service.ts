import { getDbConnection } from "./database";

import { AvailableAppServices } from "@vivid/app-store/services";

import {
  Appointment,
  AppointmentEntity,
  AppointmentTimeNotAvaialbleError,
  Customer,
  CustomerUpdateModel,
  IServicesService,
  TimeSlot,
  type AppointmentEvent,
  type AppointmentStatus,
  type Asset,
  type Availability,
  type BookingConfiguration,
  type DateRange,
  type DaySchedule,
  type Event,
  type GeneralConfiguration,
  type IAppointmentHook,
  type IAssetsService,
  type ICalendarBusyTimeProvider,
  type IConfigurationService,
  type IConnectedAppsService,
  type ICustomersService,
  type IEventsService,
  type IScheduleService,
  type Period,
  type Query,
  type WithTotal,
} from "@vivid/types";
import {
  buildSearchQuery,
  escapeRegex,
  getAppointmentBucket,
  getAvailableTimeSlotsInCalendar,
  getAvailableTimeSlotsWithPriority,
  getIcsEventUid,
  parseTime,
} from "@vivid/utils";
import { DateTime } from "luxon";
import mimeType from "mime-type/with-db";
import { Filter, ObjectId, Sort } from "mongodb";
import { v4 } from "uuid";
import { ASSETS_COLLECTION_NAME } from "./assets.service";
import { CUSTOMERS_COLLECTION_NAME } from "./customers.service";

export const APPOINTMENTS_COLLECTION_NAME = "appointments";

export class EventsService implements IEventsService {
  constructor(
    private readonly configurationService: IConfigurationService,
    private readonly appsService: IConnectedAppsService,
    private readonly assetsService: IAssetsService,
    private readonly customersService: ICustomersService,
    private readonly scheduleService: IScheduleService,
    private readonly servicesService: IServicesService
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
    confirmed: propsConfirmed,
    force = false,
    files,
  }: {
    event: AppointmentEvent;
    confirmed?: boolean;
    force?: boolean;
    files?: Record<string, File>;
  }): Promise<Appointment> {
    const { booking: config, general: generalConfig } =
      await this.configurationService.getConfigurations("booking", "general");

    if (!force) {
      const eventTime = DateTime.fromJSDate(event.dateTime, {
        zone: "utc",
      }).setZone(config.timeZone);

      if (eventTime < DateTime.now()) {
        throw new AppointmentTimeNotAvaialbleError("Time is not available");
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

        const asset = await this.assetsService.createAsset(
          {
            filename: `${getAppointmentBucket(appointmentId)}/${fieldId}-${file.name}`,
            mimeType: fileType,
            appointmentId,
            description: `${event.fields.name} - ${event.option.name} - ${fieldId}`,
          },
          file
        );

        assets.push(asset);
      }
    }

    const confirmed = propsConfirmed ?? config.autoConfirm ?? false;

    const appointment = await this.saveEvent(
      appointmentId,
      event,
      assets.length ? assets : undefined,
      confirmed ? "confirmed" : "pending",
      force
    );

    const hooks =
      await this.appsService.getAppsByScopeWithData("appointment-hook");

    const promises = hooks.map(async (hook) => {
      const service = AvailableAppServices[hook.name](
        this.appsService.getAppServiceProps(hook._id)
      ) as any as IAppointmentHook;

      try {
        await service.onAppointmentCreated(hook, appointment, confirmed);

        // if (confirmed) {
        //   await service.onAppointmentStatusChanged(
        //     hook,
        //     appointment,
        //     "confirmed"
        //   );
        // }
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
    const filter: Filter<AppointmentEntity> = {
      status: "pending",
      dateTime: after
        ? {
            $gte: after,
          }
        : undefined,
    };

    const collection = db.collection<AppointmentEntity>(
      APPOINTMENTS_COLLECTION_NAME
    );

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

    const [result] = await db
      .collection<AppointmentEntity>(APPOINTMENTS_COLLECTION_NAME)
      .aggregate([
        {
          $match: filter,
        },
        {
          $sort: { dateTime: 1 },
        },
        ...this.aggregateJoin,
        {
          $facet: {
            paginatedResults: [],
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

  // public async getNextAppointments(date: Date, limit = 5) {
  //   const db = await getDbConnection();
  //   const appointments = db.collection<AppointmentEntity>(
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
    const appointments = db.collection<AppointmentEntity>(
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
        ...this.aggregateJoin,
        { $limit: limit },
      ])
      .toArray();

    return result as Appointment[];
  }

  public async getAppointments(
    query: Query & {
      range?: DateRange;
      status?: AppointmentStatus[];
      customerId?: string | string[];
      discountId?: string | string[];
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

    if (query.customerId) {
      filter.customerId = {
        $in: Array.isArray(query.customerId)
          ? query.customerId
          : [query.customerId],
      };
    }

    if (query.discountId) {
      filter["discount.id"] = {
        $in: Array.isArray(query.discountId)
          ? query.discountId
          : [query.discountId],
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
        // @ts-ignore value
        "fields.v"
      );

      filter.$or = queries;
    }

    const [result] = await db
      .collection<AppointmentEntity>(APPOINTMENTS_COLLECTION_NAME)
      .aggregate([
        {
          $addFields: {
            fields: {
              $objectToArray: "$fields",
            },
          },
        },
        {
          $match: filter,
        },
        {
          $sort: sort,
        },
        {
          $addFields: {
            fields: {
              $arrayToObject: "$fields",
            },
          },
        },
        ...this.aggregateJoin,
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
        dateTime: event.startAt,
        totalDuration: DateTime.fromJSDate(event.endAt).diff(
          DateTime.fromJSDate(event.startAt),
          "minutes"
        ).minutes,
        uid: event.uid,
      }))
      .filter((event) => !skipUids.has(event.uid));

    return [...appointments.items, ...appsEvents];
  }

  public async getAppointment(id: string): Promise<Appointment | null> {
    const db = await getDbConnection();
    const appointments = db.collection<AppointmentEntity>(
      APPOINTMENTS_COLLECTION_NAME
    );

    const result = await appointments
      .aggregate([
        {
          $match: {
            _id: id,
          },
        },
        ...this.aggregateJoin,
      ])
      .next();

    return result as Appointment | null;
  }

  public async changeAppointmentStatus(
    id: string,
    newStatus: AppointmentStatus
  ) {
    const appointment = await this.getAppointment(id);

    if (!appointment) return;
    const oldStatus = appointment.status;

    if (oldStatus === newStatus) return;

    const db = await getDbConnection();
    await db
      .collection<AppointmentEntity>(APPOINTMENTS_COLLECTION_NAME)
      .updateOne(
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

    await db
      .collection<AppointmentEntity>(APPOINTMENTS_COLLECTION_NAME)
      .updateOne(
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
      .collection<AppointmentEntity>(APPOINTMENTS_COLLECTION_NAME)
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

        const id = v4();
        const asset = await this.assetsService.createAsset(
          {
            filename: `${getAppointmentBucket(appointmentId)}/${id}-${file.name}`,
            mimeType: fileType,
            appointmentId,
            description: `${event.fields.name} - ${event.option.name}`,
          },
          file
        );

        assets.push({ ...asset, appointment: event });
      }
    }

    return assets;
  }

  public async rescheduleAppointment(
    id: string,
    newTime: Date,
    newDuration: number
  ) {
    const appointment = await this.getAppointment(id);

    if (!appointment) return;
    const oldTime = appointment.dateTime;
    const oldDuration = appointment.totalDuration;

    const db = await getDbConnection();
    await db
      .collection<AppointmentEntity>(APPOINTMENTS_COLLECTION_NAME)
      .updateOne(
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

    let results: TimeSlot[];
    if (!config.allowSmartSchedule) {
      results = getAvailableTimeSlotsInCalendar({
        calendarEvents: events.map((event) => ({
          ...event,
          startAt: DateTime.fromJSDate(event.startAt),
          endAt: DateTime.fromJSDate(event.endAt),
        })),
        configuration: {
          timeSlotDuration: duration,
          schedule,
          timeZone: config.timeZone || DateTime.now().zoneName!,
          minAvailableTimeAfterSlot: config.breakDuration ?? 0,
          minAvailableTimeBeforeSlot: config.breakDuration ?? 0,
          slotStart: config.slotStart ?? 15,
          customSlots,
        },
        from: start.toJSDate(),
        to: end.toJSDate(),
      });
    } else {
      // Smart schedule
      let servicesDurations: number[] | undefined = undefined;
      if (config.smartSchedule?.maximizeForOption) {
        const service = await this.servicesService.getOption(
          config.smartSchedule.maximizeForOption
        );
        if (service?.duration) {
          servicesDurations = [service.duration];
        }
      }

      results = getAvailableTimeSlotsWithPriority({
        events: events.map((event) => ({
          ...event,
          startAt: DateTime.fromJSDate(event.startAt),
          endAt: DateTime.fromJSDate(event.endAt),
        })),
        duration,
        schedule,
        configuration: {
          timeZone: config.timeZone || DateTime.now().zoneName!,
          breakDuration: config.breakDuration ?? 0,
          slotStart: config.slotStart ?? 15,
          allowSkipBreak: config.smartSchedule?.allowSkipBreak,
          filterLowPrioritySlots: true,
          lowerPriorityIfNoFollowingBooking: true,
          discourageLargeGaps: true,
          allowSmartSlotStarts: config.smartSchedule?.allowSmartSlotStarts,
          preferBackToBack: config.smartSchedule?.preferBackToBack,
          customSlots,
        },
        start,
        end,
        allServiceDurations: servicesDurations, //  servicesDurations
      });
    }

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
      .collection<AppointmentEntity>(APPOINTMENTS_COLLECTION_NAME)
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
      startAt: DateTime.fromJSDate(x.dateTime, { zone: "utc" }).toJSDate(),
      endAt: DateTime.fromJSDate(x.dateTime, { zone: "utc" })
        .plus({
          minutes: x.duration,
        })
        .toJSDate(),
    }));
  }

  private async getDbDeclinedEventIds(
    start: DateTime,
    end: DateTime
  ): Promise<string[]> {
    const db = await getDbConnection();
    const ids = await db
      .collection<AppointmentEntity>(APPOINTMENTS_COLLECTION_NAME)
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
    id: string,
    event: AppointmentEvent,
    files?: Asset[],
    status: AppointmentStatus = "pending",
    force?: boolean
  ): Promise<Appointment> {
    const db = await getDbConnection();
    const appointments = db.collection<AppointmentEntity>(
      APPOINTMENTS_COLLECTION_NAME
    );

    const customer = await this.getCustomer(event);
    await this.updateCustomerIfNeeded(customer, event);

    if (customer.dontAllowBookings && !force) {
      console.error(
        `Customer ${customer.name} is not allowed to make appointments`
      );
      throw new Error(
        `Customer ${customer.name} is not allowed to make appointments`
      );
    }

    const dbEvent: AppointmentEntity = {
      _id: id,
      ...event,
      status,
      createdAt: DateTime.now().toJSDate(),
      customerId: customer._id,
    };

    await appointments.insertOne(dbEvent);

    return {
      ...dbEvent,
      customer,
      files,
    };
  }

  private async getCustomer(event: AppointmentEvent): Promise<Customer> {
    const existingCustomer = await this.customersService.findCustomer(
      event.fields.email.trim(),
      event.fields.phone.trim()
    );

    if (existingCustomer) return existingCustomer;

    const customer: CustomerUpdateModel = {
      email: event.fields.email.trim(),
      name: event.fields.name.trim(),
      phone: event.fields.phone.trim(),
      knownEmails: [],
      knownNames: [],
      knownPhones: [],
    };

    const customerId = await this.customersService.createCustomer(customer);
    return {
      _id: customerId,
      ...customer,
    };
  }

  private async updateCustomerIfNeeded(
    customer: Customer,
    event: AppointmentEvent
  ): Promise<void> {
    let needsUpdate = false;
    const name = event.fields.name.trim();
    if (customer.name !== name && !customer.knownNames.includes(name)) {
      customer.knownNames.push(name);
      needsUpdate = true;
    }

    const email = event.fields.email.trim();
    if (customer.email !== email && !customer.knownEmails.includes(email)) {
      customer.knownEmails.push(email);
      needsUpdate = true;
    }

    const phone = event.fields.phone.trim();
    if (customer.phone !== phone && !customer.knownPhones.includes(phone)) {
      customer.knownPhones.push(phone);
      needsUpdate = true;
    }

    if (needsUpdate) {
      await this.customersService.updateCustomer(customer._id, customer);
    }
  }

  private get aggregateJoin() {
    return [
      {
        $lookup: {
          from: CUSTOMERS_COLLECTION_NAME,
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $lookup: {
          from: ASSETS_COLLECTION_NAME,
          localField: "_id",
          foreignField: "appointmentId",
          as: "files",
        },
      },
      {
        $set: {
          customer: {
            $first: "$customer",
          },
        },
      },
    ];
  }
}
