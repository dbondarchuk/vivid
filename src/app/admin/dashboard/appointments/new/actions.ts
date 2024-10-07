"use server";

import { Services } from "@/lib/services";
import { AppointmentEvent } from "@/types";

export const createAppointment = async (
  appointment: Omit<AppointmentEvent, "timeZone">,
  confirmed: boolean = false
) => {
  const { timezone } = await Services.ConfigurationService().getConfiguration(
    "booking"
  );

  const appointmentEvent: AppointmentEvent = {
    ...appointment,
    timeZone: timezone,
  };

  const result = await Services.EventsService().createEvent(
    appointmentEvent,
    confirmed ? "confirmed" : "pending"
  );

  return result._id;
};
