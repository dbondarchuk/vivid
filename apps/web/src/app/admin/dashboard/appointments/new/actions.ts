"use server";

import { ServicesContainer } from "@vivid/services";
import { Appointment, AppointmentEvent } from "@vivid/types";

export const createAppointment = async (
  appointment: Omit<AppointmentEvent, "timeZone">,
  files: Record<string, File> | undefined,
  confirmed: boolean = false
) => {
  const { timeZone } =
    await ServicesContainer.ConfigurationService().getConfiguration("booking");

  const appointmentEvent: AppointmentEvent = {
    ...appointment,
    fields: Object.entries(appointment.fields)
      .filter(([key]) => !(key in (files || {})))
      .reduce(
        (map, [key, value]) => ({ ...map, [key]: value }),
        {} as Appointment["fields"]
      ),
    timeZone,
  };

  const result = await ServicesContainer.EventsService().createEvent({
    event: appointmentEvent,
    confirmed,
    force: true,
    files,
  });

  return result._id;
};
