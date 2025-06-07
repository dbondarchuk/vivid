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

export async function updateAppointmentNote(id: string, note?: string) {
  await ServicesContainer.EventsService().updateAppointmentNote(id, note);
  return okStatus;
}

export async function addAppointmentFiles(formData: FormData) {
  const file = formData.get("file") as File;
  const id = formData.get("appointmentId") as string;
  if (!id || !file) {
    throw new Error("Appointment ID and file are required");
  }

  return await ServicesContainer.EventsService().addAppointmentFiles(id, [
    file,
  ]);
}

export async function removeAppointmentFile(assetId: string) {
  await ServicesContainer.AssetsService().deleteAsset(assetId);

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
