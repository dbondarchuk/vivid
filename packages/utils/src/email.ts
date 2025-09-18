import {
  Appointment,
  AppointmentStatus,
  EventAttributes,
  GeneralConfiguration,
  IcalEventMethod,
  ParticipationStatus,
} from "@vivid/types";
import { DateTime } from "luxon";
import { getIcsEventUid } from "./ics-uid";

export type CalendarEventOptions = {
  from: string;
  address?: string;
  name: string;
  url: string;
};

export const AppointmentStatusToICalMethodMap: Record<
  AppointmentStatus | "rescheduled",
  IcalEventMethod
> = {
  pending: "REQUEST",
  confirmed: "PUBLISH",
  declined: "CANCEL",
  rescheduled: "REQUEST",
};

export const getEventCalendarContent = (
  generalConfig: GeneralConfiguration,
  event: Appointment,
  summary: string,
  description: string,
  method: IcalEventMethod = "REQUEST",
) => {
  const { address, name, url, email } = generalConfig;

  const config: CalendarEventOptions = {
    from: email,
    address,
    name,
    url,
  };

  const date = DateTime.fromJSDate(event.dateTime);

  let ownStatus: ParticipationStatus = "TENTATIVE";
  switch (method) {
    case "PUBLISH":
      ownStatus = "ACCEPTED";
      break;

    case "CANCEL":
      ownStatus = "DECLINED";
      break;
  }

  const icsEvent: EventAttributes = {
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
    htmlContent: description,
    location: config.address,
    sequence: getIcsSequence(),
    attendees: [
      {
        partstat: "ACCEPTED",
        name: event.fields.name,
        email: event.fields.email,
      },
      {
        partstat: ownStatus,
        name: config.name,
        email: config.from,
      },
    ],
  };

  return icsEvent;
};

export const getIcsSequence = () => Math.floor(Date.now() / 100000);
