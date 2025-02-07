"use server";

import { ServicesContainer } from "@vivid/services";
import { AppointmentEvent } from "@vivid/types";

export const createAppointment = async (
  appointment: Omit<AppointmentEvent, "timeZone">,
  confirmed: boolean = false
) => {
  const { timezone } =
    await ServicesContainer.ConfigurationService().getConfiguration("booking");

  const appointmentEvent: AppointmentEvent = {
    ...appointment,
    timeZone: timezone,
  };

  const result = await ServicesContainer.EventsService().createEvent({
    event: appointmentEvent,
    status: confirmed ? "confirmed" : "pending",
    force: true,
  });

  return result._id;
};
