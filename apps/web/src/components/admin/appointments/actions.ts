"use server";

import { ServicesContainer } from "@vivid/services";
import { AppointmentStatus, okStatus } from "@vivid/types";

export async function changeAppointmentStatus(
  id: string,
  newStatus: AppointmentStatus
) {
  await ServicesContainer.EventsService().changeAppointmentStatus(
    id,
    newStatus
  );
  return okStatus;
}

export async function updatAppointmentNote(id: string, note?: string) {
  await ServicesContainer.EventsService().updateAppointmentNote(id, note);
  return okStatus;
}

export async function rescheduleAppointment(
  id: string,
  dateTime: Date,
  duration: number
) {
  await ServicesContainer.EventsService().rescheduleAppointment(
    id,
    dateTime,
    duration
  );
  return okStatus;
}
