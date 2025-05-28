import { renderToStaticMarkup } from "@vivid/email-builder/static";
import {
  Appointment,
  BookingConfiguration,
  ConnectedAppData,
  ConnectedAppStatusWithText,
  GeneralConfiguration,
  IConnectedApp,
  IConnectedAppProps,
  IScheduled,
  ITextMessageResponder,
  ServiceField,
  SocialConfiguration,
  TextMessageReply,
  WithTotal,
} from "@vivid/types";
import {
  buildSearchQuery,
  getArguments,
  getPhoneField,
  template,
  templateSafeWithError,
} from "@vivid/utils";
import { DateTime } from "luxon";
import { ObjectId, type Filter, type Sort } from "mongodb";
import ownerTextMessageReplyTemplate from "./emails/owner-text-message-reply.html";
import {
  GetRemindersAction,
  Reminder,
  RemindersAppData,
  remindersAppDataSchema,
  ReminderUpdateModel,
  RequestAction,
} from "./models";

const REMINDERS_COLLECTION_NAME = "reminders";

export default class RemindersConnectedApp
  implements IConnectedApp, IScheduled, ITextMessageResponder
{
  public constructor(protected readonly props: IConnectedAppProps) {}

  public async processRequest(
    appData: ConnectedAppData,
    data: RequestAction
  ): Promise<any> {
    switch (data.type) {
      case "get-reminder":
        return await this.getReminder(appData._id, data.id);

      case "get-reminders":
        return await this.getReminders(appData._id, data.query);

      case "delete-reminders":
        return await this.deleteReminders(appData._id, data.ids);

      case "create-reminder":
        return await this.createReminder(appData._id, data.reminder);

      case "update-reminder":
        return await this.updateReminder(appData._id, data.id, data.update);

      case "check-unique-name":
        return await this.checkUniqueName(appData._id, data.name, data.id);

      case "get-app-data":
        return appData.data;

      case "set-app-data": {
        const {
          success,
          data: parsed,
          error,
        } = remindersAppDataSchema.safeParse(data.data);
        if (!success) {
          throw new Error(error.message);
        }

        console.log(parsed);

        await this.props.update({
          data: parsed,
        });

        return;
      }

      default: {
        const defaultApps = await this.props.services
          .ConfigurationService()
          .getConfiguration("defaultApps");

        try {
          const emailAppId = defaultApps.email?.appId;
          await this.props.services.ConnectedAppService().getApp(emailAppId!);
        } catch {
          return {
            status: "failed",
            statusText: "Text message sender default app is not configured",
          };
        }

        const status: ConnectedAppStatusWithText = {
          status: "connected",
          statusText: `Successfully set up`,
        };

        this.props.update({
          data,
          ...status,
        });

        return status;
      }
    }
  }

  public async unInstall(appData: ConnectedAppData): Promise<void> {
    const db = await this.props.getDbConnection();
    const collection = db.collection<Reminder>(REMINDERS_COLLECTION_NAME);
    await collection.deleteMany({
      appId: appData._id,
    });

    const count = await collection.countDocuments({});
    if (count === 0) {
      await db.dropCollection(REMINDERS_COLLECTION_NAME);
    }
  }

  protected async getReminder(appId: string, id: string) {
    const db = await this.props.getDbConnection();

    return await db.collection<Reminder>(REMINDERS_COLLECTION_NAME).findOne({
      appId,
      _id: id,
    });
  }

  protected async getReminders(
    appId: string,
    query: GetRemindersAction["query"]
  ): Promise<WithTotal<Reminder>> {
    const db = await this.props.getDbConnection();

    const sort: Sort = query.sort?.reduce(
      (prev, curr) => ({
        ...prev,
        [curr.id]: curr.desc ? -1 : 1,
      }),
      {}
    ) || { updatedAt: -1 };

    const filter: Filter<Reminder> = {
      appId,
    };

    if (query.channel) {
      filter.channel = {
        $in: query.channel,
      };
    }

    if (query.search) {
      const $regex = new RegExp(query.search, "i");
      const queries = buildSearchQuery<Reminder>({ $regex }, "name");

      filter.$or = queries;
    }

    const [result] = await db
      .collection<Reminder>(REMINDERS_COLLECTION_NAME)
      .aggregate([
        {
          $sort: sort,
        },
        {
          $match: filter,
        },
        {
          $project: {
            value: false,
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

  protected async createReminder(
    appId: string,
    reminder: ReminderUpdateModel
  ): Promise<Reminder> {
    const dbReminder: Reminder = {
      ...reminder,
      appId,
      _id: new ObjectId().toString(),
      updatedAt: DateTime.utc().toJSDate(),
    };

    if (!this.checkUniqueName(appId, reminder.name)) {
      throw new Error("Name already exists");
    }

    const db = await this.props.getDbConnection();
    const reminders = db.collection<Reminder>(REMINDERS_COLLECTION_NAME);

    await reminders.insertOne(dbReminder);

    return dbReminder;
  }

  protected async updateReminder(
    appId: string,
    id: string,
    update: ReminderUpdateModel
  ): Promise<void> {
    const db = await this.props.getDbConnection();
    const reminders = db.collection<Reminder>(REMINDERS_COLLECTION_NAME);

    const { _id, ...updateObj } = update as Reminder; // Remove fields in case it slips here

    if (!this.checkUniqueName(appId, update.name, id)) {
      throw new Error("Name already exists");
    }

    updateObj.updatedAt = DateTime.utc().toJSDate();

    await reminders.updateOne(
      {
        _id: id,
      },
      {
        $set: updateObj,
      }
    );
  }

  protected async deleteReminders(appId: string, ids: string[]): Promise<void> {
    const db = await this.props.getDbConnection();
    const reminders = db.collection<Reminder>(REMINDERS_COLLECTION_NAME);

    await reminders.deleteMany({
      appId,
      _id: {
        $in: ids,
      },
    });
  }

  protected async checkUniqueName(
    appId: string,
    name: string,
    id?: string
  ): Promise<boolean> {
    const db = await this.props.getDbConnection();
    const templates = db.collection<Reminder>(REMINDERS_COLLECTION_NAME);

    const filter: Filter<Reminder> = {
      name,
      appId,
    };

    if (id) {
      filter._id = {
        $ne: id,
      };
    }

    const result = await templates.countDocuments(filter);
    return result === 0;
  }

  public async onTime(appData: ConnectedAppData, date: Date): Promise<void> {
    const {
      booking: bookingConfig,
      general: generalConfig,
      social: socialConfig,
    } = await this.props.services
      .ConfigurationService()
      .getConfigurations("booking", "general", "social");

    const phoneFields = (
      await this.props.services.ServicesService().getFields({
        type: ["phone"],
      })
    ).items;

    const timeZone = bookingConfig.timeZone;
    const db = await this.props.getDbConnection();

    const reminders = await db
      .collection<Reminder>(REMINDERS_COLLECTION_NAME)
      .find({
        appId: appData._id,
      })
      .toArray();

    const promises = (reminders || []).map(async (reminder) => {
      const appointments = await this.getAppointments(date, reminder, timeZone);
      const appointmentPromises = appointments.map((appointment) =>
        this.sendReminder(
          appData,
          appointment,
          reminder,
          bookingConfig,
          generalConfig,
          socialConfig,
          phoneFields
        )
      );

      return Promise.all(appointmentPromises);
    });

    await Promise.all(promises);
  }

  private async getAppointments(
    date: Date,
    reminder: Reminder,
    timeZone: string
  ): Promise<Appointment[]> {
    const type = reminder.type;
    switch (type) {
      case "timeBefore": {
        const startDate = DateTime.fromJSDate(date)
          .setZone(timeZone)
          .startOf("minute")
          .plus({
            days: reminder.days,
            weeks: reminder.weeks,
            hours: reminder.hours,
            minutes: reminder.minutes,
          });

        const endDate = startDate.plus({ minutes: 1, seconds: -1 });

        const appointments = await this.props.services
          .EventsService()
          .getAppointments({
            status: ["confirmed"],
            range: {
              start: startDate.toJSDate(),
              end: endDate.toJSDate(),
            },
          });

        console.log(
          `Found ${
            appointments.total
          } appointments between ${startDate.toISO()} and ${endDate.toISO()} for reminder ${
            reminder.name
          }`
        );

        return appointments.items;
      }

      case "atTime": {
        const dt = DateTime.fromJSDate(date).setZone(timeZone);
        if (
          dt.hour !== reminder.time.hour ||
          dt.minute !== reminder.time.minute
        )
          return [];

        const startDate = dt
          .startOf("day")
          .plus({ days: reminder.days, weeks: reminder.weeks });

        const endDate = startDate.plus({ days: 1, seconds: -1 });

        console.log(
          `Looking for appointments between ${startDate.toISO()} and ${endDate.toISO()} for reminder ${
            reminder.name
          }`
        );

        const appointments = await this.props.services
          .EventsService()
          .getAppointments({
            status: ["confirmed"],
            range: {
              start: startDate.toJSDate(),
              end: endDate.toJSDate(),
            },
          });

        console.log(
          `Found ${
            appointments.total
          } appointments between ${startDate.toISO()} and ${endDate.toISO()} for reminder ${
            reminder.name
          }`
        );

        return appointments.items;
      }

      default:
        console.error(`Unknown reminder type: ${type}`);
        return [];
    }
  }

  private async sendReminder(
    appData: ConnectedAppData,
    appointment: Appointment,
    reminder: Reminder,
    config: BookingConfiguration,
    generalConfig: GeneralConfiguration,
    socialConfig: SocialConfiguration,
    phoneFields: ServiceField[]
  ): Promise<void> {
    const { arg } = getArguments(
      appointment,
      config,
      generalConfig,
      socialConfig,
      true
    );

    const channel = reminder.channel;
    const template = await this.props.services
      .TemplatesService()
      .getTemplate(reminder.templateId);
    if (!template) {
      console.warn(`Can't find template ${reminder.templateId}`);
      return;
    }

    switch (channel) {
      case "email":
        return this.props.services.NotificationService().sendEmail({
          email: {
            body: await renderToStaticMarkup({
              args: arg,
              document: template.value,
            }),
            subject: templateSafeWithError(reminder.subject, arg),
            to: appointment.fields.email,
          },
          initiator: `Reminder Service - ${reminder.name}`,
          appointmentId: appointment._id,
        });

      case "text-message":
        const phone = getPhoneField(appointment, phoneFields);
        if (!phone) {
          console.warn(
            `Can't find the phone field for appointment ${appointment._id}`
          );

          return;
        }

        await this.props.services.NotificationService().sendTextMessage({
          phone,
          sender: generalConfig.name,
          body: templateSafeWithError(template.value, arg),
          webhookData: {
            data: appointment._id,
            appId: appData._id,
          },
          initiator: `Reminder service - ${reminder.name}`,
          appointmentId: appointment._id,
        });

        return;

      default:
        console.error(`Unknow reminder channel type: ${channel}`);
        return;
    }
  }

  public async respond(
    appData: ConnectedAppData,
    data: string,
    reply: TextMessageReply
  ): Promise<void> {
    const bodyTemplate = ownerTextMessageReplyTemplate;

    const appointment = await this.props.services
      .EventsService()
      .getAppointment(data);

    if (!appointment) {
      // todo
    }

    const config = await this.props.services
      .ConfigurationService()
      .getConfigurations("booking", "general", "social");

    const args = getArguments(
      appointment as Appointment,
      config.booking,
      config.general,
      config.social,
      true
    );

    const arg = {
      ...args.arg,
      reply,
    };

    const description = template(bodyTemplate, arg);

    await this.props.services.NotificationService().sendEmail({
      email: {
        to: args.generalConfiguration.email,
        subject: "SMS reply",
        body: description,
      },
      initiator: "Reminders Text Message Reply - notify owner",
      appointmentId: appointment?._id,
    });

    const { textMessageAutoReplyTemplateId } = (appData.data ||
      {}) as RemindersAppData;

    if (textMessageAutoReplyTemplateId) {
      const autoReplyTemplate = await this.props.services
        .TemplatesService()
        .getTemplate(textMessageAutoReplyTemplateId);

      if (!autoReplyTemplate?.value) return;

      const replyBody = template(autoReplyTemplate.value, arg);
      await this.props.services.NotificationService().sendTextMessage({
        phone: reply.from,
        sender: args.generalConfiguration.name,
        body: replyBody,
        webhookData: reply.data,
        initiator: "Reminders Text Message Reply - auto reply",
        appointmentId: appointment?._id,
      });
    }
  }
}
