"use server";

import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { GeneralConfiguration } from "@vivid/types";

const logger = getLoggerFactory("GeneralConfigurationActions");

export async function updateGeneralConfiguration(data: GeneralConfiguration) {
  const actionLogger = logger("updateGeneralConfiguration");

  actionLogger.debug(
    {
      hasBusinessName: !!data.name,
      hasBusinessEmail: !!data.email,
      hasBusinessPhone: !!data.phone,
      hasBusinessAddress: !!data.address,
    },
    "Updating general configuration",
  );

  try {
    await ServicesContainer.ConfigurationService().setConfiguration(
      "general",
      data,
    );

    actionLogger.debug(
      {
        hasBusinessName: !!data.name,
        hasBusinessEmail: !!data.email,
        hasBusinessPhone: !!data.phone,
        hasBusinessAddress: !!data.address,
      },
      "General configuration updated successfully",
    );
  } catch (error) {
    actionLogger.error(
      {
        hasBusinessName: !!data.name,
        hasBusinessEmail: !!data.email,
        hasBusinessPhone: !!data.phone,
        hasBusinessAddress: !!data.address,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to update general configuration",
    );
    throw error;
  }
}
