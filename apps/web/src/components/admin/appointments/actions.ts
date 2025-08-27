"use server";

import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { AppointmentStatus, okStatus } from "@vivid/types";

const logger = getLoggerFactory("AppointmentsActions");

export async function changeAppointmentStatus(
  id: string,
  newStatus: AppointmentStatus,
) {
  const actionLogger = logger("changeAppointmentStatus");

  actionLogger.debug(
    {
      appointmentId: id,
      newStatus,
    },
    "Changing appointment status",
  );

  try {
    await ServicesContainer.EventsService().changeAppointmentStatus(
      id,
      newStatus,
    );

    actionLogger.debug(
      {
        appointmentId: id,
        newStatus,
      },
      "Appointment status changed successfully",
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        appointmentId: id,
        newStatus,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to change appointment status",
    );
    throw error;
  }
}

export async function updateAppointmentNote(id: string, note?: string) {
  const actionLogger = logger("updateAppointmentNote");

  actionLogger.debug(
    {
      appointmentId: id,
      hasNote: !!note,
      noteLength: note?.length || 0,
    },
    "Updating appointment note",
  );

  try {
    await ServicesContainer.EventsService().updateAppointmentNote(id, note);

    actionLogger.debug(
      {
        appointmentId: id,
        hasNote: !!note,
      },
      "Appointment note updated successfully",
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        appointmentId: id,
        hasNote: !!note,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to update appointment note",
    );
    throw error;
  }
}

export async function addAppointmentFiles(formData: FormData) {
  const actionLogger = logger("addAppointmentFiles");

  const file = formData.get("file") as File;
  const id = formData.get("appointmentId") as string;

  if (!id || !file) {
    actionLogger.error(
      {
        appointmentId: id,
        hasFile: !!file,
      },
      "Appointment ID and file are required",
    );
    throw new Error("Appointment ID and file are required");
  }

  actionLogger.debug(
    {
      appointmentId: id,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    },
    "Adding appointment files",
  );

  try {
    const result = await ServicesContainer.EventsService().addAppointmentFiles(
      id,
      [file],
    );

    actionLogger.debug(
      {
        appointmentId: id,
        fileName: file.name,
        fileSize: file.size,
      },
      "Appointment files added successfully",
    );

    return result;
  } catch (error) {
    actionLogger.error(
      {
        appointmentId: id,
        fileName: file.name,
        fileSize: file.size,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to add appointment files",
    );
    throw error;
  }
}

export async function removeAppointmentFile(assetId: string) {
  const actionLogger = logger("removeAppointmentFile");

  actionLogger.debug(
    {
      assetId,
    },
    "Removing appointment file",
  );

  try {
    await ServicesContainer.AssetsService().deleteAsset(assetId);

    actionLogger.debug(
      {
        assetId,
      },
      "Appointment file removed successfully",
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        assetId,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to remove appointment file",
    );
    throw error;
  }
}

export async function rescheduleAppointment(
  id: string,
  dateTime: Date,
  duration: number,
) {
  const actionLogger = logger("rescheduleAppointment");

  actionLogger.debug(
    {
      appointmentId: id,
      newDateTime: dateTime.toISOString(),
      newDuration: duration,
    },
    "Rescheduling appointment",
  );

  try {
    await ServicesContainer.EventsService().rescheduleAppointment(
      id,
      dateTime,
      duration,
    );

    actionLogger.debug(
      {
        appointmentId: id,
        newDateTime: dateTime.toISOString(),
        newDuration: duration,
      },
      "Appointment rescheduled successfully",
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        appointmentId: id,
        newDateTime: dateTime.toISOString(),
        newDuration: duration,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to reschedule appointment",
    );
    throw error;
  }
}
