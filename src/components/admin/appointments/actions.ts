"use server";

import { Services } from "@/lib/services";
import { AppointmentStatus } from "@/types";
import { okStatus } from "@/types/general/actionStatus";

export async function changeAppointmentStatus(
  id: string,
  newStatus: AppointmentStatus
) {
  await Services.EventsService().changeAppointmentStatus(id, newStatus);
  return okStatus;
}

export async function updatAppointmentNote(id: string, note?: string) {
  await Services.EventsService().updateAppointmentNote(id, note);
  return okStatus;
}

export async function rescheduleAppointment(
  id: string,
  dateTime: Date,
  duration: number
) {
  await Services.EventsService().rescheduleAppointment(id, dateTime, duration);
  return okStatus;
}
