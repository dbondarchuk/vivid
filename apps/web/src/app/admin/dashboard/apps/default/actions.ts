"use server";

import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { DefaultAppsConfiguration } from "@vivid/types";

const logger = getLoggerFactory("DefaultAppsActions");

export async function updateDefaultAppsConfiguration(
  data: DefaultAppsConfiguration,
) {
  const actionLogger = logger("updateDefaultAppsConfiguration");

  actionLogger.debug(
    {
      defaultAppsCount: Object.keys(data).length,
      defaultApps: Object.keys(data),
    },
    "Updating default apps configuration",
  );

  try {
    await ServicesContainer.ConfigurationService().setConfiguration(
      "defaultApps",
      data,
    );

    actionLogger.debug(
      {
        defaultAppsCount: Object.keys(data).length,
        defaultApps: Object.keys(data),
      },
      "Default apps configuration updated successfully",
    );
  } catch (error) {
    actionLogger.error(
      {
        defaultAppsCount: Object.keys(data).length,
        defaultApps: Object.keys(data),
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to update default apps configuration",
    );
    throw error;
  }
}
