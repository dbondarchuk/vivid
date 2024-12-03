import { Appointment } from "@/types";
import * as ics from "ics";
import { DateTime } from "luxon";
import { getIcsEventUid } from "../../helpers/ics";
import {
  BaseNotificationService,
  IcalEventMethod,
} from "../notificaionService.base";

export type CalendarEventOptions = {
  from: string;
  address?: string;
  name: string;
  url: string;
};

export abstract class IEmailNotificationService extends BaseNotificationService {
  protected getSmtpConfiguration = () =>
    this.configurationService.getConfiguration("smtp");

  protected async getEventCalendarContent(
    event: Appointment,
    summary: string,
    description: string,
    method: IcalEventMethod = "REQUEST"
  ) {
    const { booking, general: generalConfig } =
      await this.configurationService.getConfigurations("booking", "general");
    const { address, name, url } = generalConfig;

    const config: CalendarEventOptions = {
      from: booking.email.from,
      address,
      name,
      url,
    };

    const date = DateTime.fromJSDate(event.dateTime);

    let ownStatus: ics.ParticipationStatus = "TENTATIVE";
    switch (method) {
      case "PUBLISH":
        ownStatus = "ACCEPTED";
        break;

      case "CANCEL":
        ownStatus = "DECLINED";
        break;
    }

    const icsEvent: ics.EventAttributes = {
      method,
      uid: getIcsEventUid(event._id, url),
      start: date.toMillis(),
      end: date.plus({ minutes: event.totalDuration }).toMillis(),
      startInputType: "utc",
      endInputType: "utc",
      organizer: {
        email: config.from,
        name: config.name,
      },
      url: `${config.url}/admin/dashboard/appointments/${event._id}`,
      title: summary,
      description: description,
      location: config.address,
      sequence: this.getIcsSequence(),
      attendees: [
        {
          partstat: "ACCEPTED",
          name: event.fields.name,
          email: event.fields.email,
        },
        {
          partstat: ownStatus,
          name: config.name,
          email: booking.email.to,
        },
      ],
    };

    return icsEvent;
  }

  private getIcsSequence = () => Math.floor(Date.now() / 100000);
}
