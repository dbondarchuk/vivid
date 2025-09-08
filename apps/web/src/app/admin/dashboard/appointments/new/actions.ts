"use server";

import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { Appointment, AppointmentEvent } from "@vivid/types";

const logger = getLoggerFactory("NewAppointmentActions");

export const createAppointment = async (
  appointment: Omit<AppointmentEvent, "timeZone">,
  files: Record<string, File> | undefined,
  confirmed: boolean = false,
) => {
  const actionLogger = logger("createAppointment");

  actionLogger.debug(
    {
      optionId: appointment.option._id,
      dateTime: appointment.dateTime.toISOString(),
      duration: appointment.totalDuration,
      filesCount: files ? Object.keys(files).length : 0,
      confirmed,
      fieldsCount: Object.keys(appointment.fields).length,
    },
    "Creating new appointment",
  );

  try {
    const { timeZone } =
      await ServicesContainer.ConfigurationService().getConfiguration(
        "general",
      );

    const appointmentEvent: AppointmentEvent = {
      ...appointment,
      fields: Object.entries(appointment.fields)
        .filter(([key]) => !(key in (files || {})))
        .reduce(
          (map, [key, value]) => ({ ...map, [key]: value }),
          {} as Appointment["fields"],
        ),
      timeZone,
    };

    actionLogger.debug(
      {
        optionId: appointment.option._id,
        dateTime: appointment.dateTime.toISOString(),
        duration: appointment.totalDuration,
        timeZone,
        processedFieldsCount: Object.keys(appointmentEvent.fields).length,
      },
      "Appointment event prepared, creating event",
    );

    const result = await ServicesContainer.EventsService().createEvent({
      event: appointmentEvent,
      confirmed,
      force: true,
      files,
      by: "user",
    });

    actionLogger.debug(
      {
        appointmentId: result._id,
        optionId: appointment.option._id,
        dateTime: appointment.dateTime.toISOString(),
        duration: appointment.totalDuration,
        confirmed,
      },
      "Appointment created successfully",
    );

    return result._id;
  } catch (error) {
    actionLogger.error(
      {
        optionId: appointment.option._id,
        dateTime: appointment.dateTime.toISOString(),
        duration: appointment.totalDuration,
        confirmed,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to create appointment",
    );
    throw error;
  }
};
