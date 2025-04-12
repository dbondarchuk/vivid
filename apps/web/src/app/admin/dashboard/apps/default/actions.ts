"use server";

import { ServicesContainer } from "@vivid/services";
import { DefaultAppsConfiguration } from "@vivid/types";

export async function updateDefaultAppsConfiguration(
  data: DefaultAppsConfiguration
) {
  await ServicesContainer.ConfigurationService().setConfiguration(
    "defaultApps",
    data
  );
}
