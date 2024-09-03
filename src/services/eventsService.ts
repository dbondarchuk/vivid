import { getDbConnection } from "@/database";
import type {
  AppointmentEvent,
  AppointmentStatus,
  Period,
  WithTotal,
} from "@/types";
import { Appointment } from "@/types";
import { DateTime } from "luxon";
import { ObjectId } from "mongodb";
import { ConfigurationService } from "./configurationService";
import { IcsBusyTimeProvider } from "./helpers/ics";
import { NotificationService } from "./notifications/notificationService";

const APPOINTMENTS_COLLECTION_NAME = "appointments";

export class EventsService {
  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly notificationService: NotificationService
  ) {}

  public async getBusyEvents(): Promise<Period[]> {
    const config = await this.configurationService.getConfiguration("booking");

    const start = DateTime.utc();
    const end = DateTime.utc().plus({ weeks: config.maxWeeksInFuture ?? 8 });

    const dbEventsPromise = this.getDbBusyTimes(start, end);

    const ics = new IcsBusyTimeProvider(config.ics);
    const icsEventsPromise = ics.getBusyTimes(start, end);

    const [dbEvents, icsEvents] = await Promise.all([
      dbEventsPromise,
      icsEventsPromise,
    ]);

    return [...dbEvents, ...icsEvents];
  }

  public async createEvent(event: AppointmentEvent): Promise<void> {
    const appointment = await this.saveEvent(event);

    await this.notificationService.sendAppointmentRequestedNotification(
      appointment
    );
  }

  public async getPendingAppointments(
    limit = 20
  ): Promise<WithTotal<Appointment>> {
    const db = await getDbConnection();
    const cursor = db
      .collection<Appointment>(APPOINTMENTS_COLLECTION_NAME)
      .find({
        status: "pending",
      });

    const appointments = await cursor.limit(limit).toArray();
    const total = await cursor.count();

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

  private async saveEvent(event: AppointmentEvent) {
    const db = await getDbConnection();
    const appointments = db.collection<Appointment>(
      APPOINTMENTS_COLLECTION_NAME
    );

    const dbEvent: Appointment = {
      ...event,
      _id: new ObjectId().toString(),
      dateTime: DateTime.fromISO(event.dateTime, { zone: "utc" }).toJSDate(),
      status: "pending",
    };

    await appointments.insertOne(dbEvent);

    return dbEvent;
  }
}
