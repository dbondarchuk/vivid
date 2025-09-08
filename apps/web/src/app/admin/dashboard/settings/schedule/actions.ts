"use server";

import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { ScheduleConfiguration } from "@vivid/types";

const logger = getLoggerFactory("ScheduleConfigurationActions");

export async function updateScheduleConfiguration(data: ScheduleConfiguration) {
  const actionLogger = logger("updateScheduleConfiguration");

  actionLogger.debug(
    {
      hasWorkingHours: !!data.schedule?.length,
      workingDaysCount: data.schedule?.length || 0,
    },
    "Updating schedule configuration",
  );

  try {
    await ServicesContainer.ConfigurationService().setConfiguration(
      "schedule",
      data,
    );

    actionLogger.debug(
      {
        hasWorkingHours: !!data.schedule?.length,
        workingDaysCount: data.schedule?.length || 0,
      },
      "Schedule configuration updated successfully",
    );
  } catch (error) {
    actionLogger.error(
      {
        hasWorkingHours: !!data.schedule?.length,
        workingDaysCount: data.schedule?.length || 0,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to update schedule configuration",
    );
    throw error;
  }
}
