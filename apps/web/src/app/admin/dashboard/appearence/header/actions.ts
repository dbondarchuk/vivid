"use server";
import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { HeaderConfiguration } from "@vivid/types";

const logger = getLoggerFactory("HeaderConfigurationActions");

export async function updateHeaderConfiguration(data: HeaderConfiguration) {
  const actionLogger = logger("updateHeaderConfiguration");

  actionLogger.debug(
    {
      showLogo: !!data.showLogo,
      menus: data.menu?.length,
    },
    "Updating header configuration"
  );

  try {
    await ServicesContainer.ConfigurationService().setConfiguration(
      "header",
      data
    );

    actionLogger.debug(
      {
        showLogo: !!data.showLogo,
        menus: data.menu?.length,
      },
      "Header configuration updated successfully"
    );
  } catch (error) {
    actionLogger.error(
      {
        showLogo: !!data.showLogo,
        menus: data.menu?.length,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to update header configuration"
    );
    throw error;
  }
}
