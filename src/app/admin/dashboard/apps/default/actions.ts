"use server";

import { Services } from "@/lib/services";
import { DefaultAppsConfiguration } from "@/types";

export async function updateDefaultAppsConfiguration(
  data: DefaultAppsConfiguration
) {
  await Services.ConfigurationService().setConfiguration("defaultApps", data);
}
