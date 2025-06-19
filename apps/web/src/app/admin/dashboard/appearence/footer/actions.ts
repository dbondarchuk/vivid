"use server";

import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { FooterConfiguration } from "@vivid/types";

const logger = getLoggerFactory("FooterConfigurationActions");

export async function updateFooterConfiguration(data: FooterConfiguration) {
  const actionLogger = logger("updateFooterConfiguration");

  actionLogger.debug(
    {
      isCustom: data.isCustom,
      hasContent: !!data.isCustom && !!data.content,
      hasLinks: !data.isCustom && !!data.links?.length,
      linksCount: !data.isCustom ? data.links?.length || 0 : 0,
    },
    "Updating footer configuration"
  );

  try {
    await ServicesContainer.ConfigurationService().setConfiguration(
      "footer",
      data
    );

    actionLogger.debug(
      {
        isCustom: data.isCustom,
        hasContent: !!data.isCustom && !!data.content,
        hasLinks: !data.isCustom && !!data.links?.length,
        linksCount: !data.isCustom ? data.links?.length || 0 : 0,
      },
      "Footer configuration updated successfully"
    );
  } catch (error) {
    actionLogger.error(
      {
        isCustom: data.isCustom,
        hasContent: !!data.isCustom && !!data.content,
        hasLinks: !data.isCustom && !!data.links?.length,
        linksCount: !data.isCustom ? data.links?.length || 0 : 0,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to update footer configuration"
    );
    throw error;
  }
}
