import {
  Appointment,
  AppointmentStatus,
  CalendarEvent,
  ConnectedAppData,
  ConnectedAppStatusWithText,
  IAppointmentHook,
  ICalendarWriter,
  IConnectedApp,
  IConnectedAppProps,
} from "@vivid/types";
import {
  AppointmentStatusToICalMethodMap,
  getArguments,
  getIcsEventUid,
} from "@vivid/utils";
import { convert } from "html-to-text";
import { CalendarWriterConfiguration } from "./models";

import { template } from "@vivid/utils";
import { AvailableApps } from "../../apps";
import autoConfirmedTemplate from "./templates/appointment-auto-confirmed.html";
import confirmedTemplate from "./templates/appointment-confirmed.html";
import pendingTemplate from "./templates/appointment-created.html";
import declinedTemplate from "./templates/appointment-declined.html";
import rescheduledTemplate from "./templates/appointment-rescheduled.html";

const bodyTemplates: Record<
  keyof typeof AppointmentStatusToICalMethodMap | "auto-confirmed",
  string
> = {
  confirmed: confirmedTemplate,
  "auto-confirmed": autoConfirmedTemplate,
  declined: declinedTemplate,
  pending: pendingTemplate,
  rescheduled: rescheduledTemplate,
};

export class CalendarWriterConnectedApp
  implements IConnectedApp, IAppointmentHook
{
  public constructor(protected readonly props: IConnectedAppProps) {}

  public async processRequest(
    appData: ConnectedAppData,
    data: CalendarWriterConfiguration
  ): Promise<ConnectedAppStatusWithText> {
    try {
      const { name: appName } = await this.props.services
        .ConnectedAppService()
        .getApp(data.appId);
      const app = AvailableApps[appName];

      if (!app.scope.includes("calendar-write")) {
        throw new Error("Wrong app scope");
      }
    } catch {
      return {
        status: "failed",
        statusText: "Calendar app is not found or does not support write",
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

  public async onAppointmentCreated(
    appData: ConnectedAppData,
    appointment: Appointment,
    confirmed: boolean
  ): Promise<void> {
    await this.makeEvent(
      appData,
      appointment,
      confirmed ? "auto-confirmed" : "pending",
      "New Request"
    );
  }

  public async onAppointmentStatusChanged(
    appData: ConnectedAppData,
    appointment: Appointment,
    newStatus: AppointmentStatus
  ): Promise<void> {
    await this.makeEvent(appData, appointment, newStatus, newStatus);
  }

  public async onAppointmentRescheduled(
    appData: ConnectedAppData,
    appointment: Appointment,
    newTime: Date,
    newDuration: number
  ): Promise<void> {
    const newAppointment: Appointment = {
      ...appointment,
      dateTime: newTime,
      totalDuration: newDuration,
    };

    await this.makeEvent(appData, newAppointment, "rescheduled", "Rescheduled");
  }

  private async makeEvent(
    appData: ConnectedAppData,
    appointment: Appointment,
    status: keyof typeof AppointmentStatusToICalMethodMap | "auto-confirmed",
    initiator: string
  ) {
    const config = await this.props.services
      .ConfigurationService()
      .getConfigurations("booking", "general", "social");
    const { arg, generalConfiguration } = getArguments(
      appointment,
      config.booking,
      config.general,
      config.social,
      true
    );

    const data = appData.data as CalendarWriterConfiguration;

    const description = template(bodyTemplates[status], arg);

    const eventSummary = `${appointment.fields.name} for ${appointment.option.name}`;

    const { app, service } = await this.props.services
      .ConnectedAppService()
      .getAppService<ICalendarWriter>(data.appId);

    const uid = getIcsEventUid(appointment._id, config.general.url);
    const newStatus =
      status === "rescheduled"
        ? appointment.status
        : status === "auto-confirmed"
          ? "confirmed"
          : status;

    const event: CalendarEvent = {
      id: appointment._id,
      title: eventSummary,
      description: {
        html: description,
        plainText: convert(description, { wordwrap: 130 })
          .trim()
          .replace(/(\r\n|\r|\n)+/g, "\n"),
        url: `${generalConfiguration.url}/admin/dashboard/appointments/${appointment._id}`,
      },
      location: {
        name: generalConfiguration.name,
        address: generalConfiguration.address,
      },
      startTime: appointment.dateTime,
      duration: appointment.totalDuration,
      timeZone: config.booking.timeZone,
      uid,
      status: newStatus,
      attendees: [
        // {
        //   name: config.general.name,
        //   email: config.general.email,
        //   status: "organizer",
        //   type: "required",
        // },
        {
          name: config.general.name,
          email: config.general.email,
          status: newStatus === "confirmed" ? "confirmed" : "tentative",
          type: "required",
        },
        {
          name: appointment.fields.name,
          email: appointment.fields.email,
          status: "confirmed",
          type: "required",
        },
      ],
    };

    if (status === "pending" || status === "auto-confirmed") {
      await service.createEvent(app, event);
    } else if (status === "declined") {
      await service.deleteEvent(app, uid, event.id);
    } else {
      service.updateEvent(app, uid, event);
    }
  }
}
