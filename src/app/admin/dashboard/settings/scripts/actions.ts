"use server";

import { Services } from "@/lib/services";
import { ScriptsConfiguration } from "@/types";

export async function updateScriptsConfiguration(data: ScriptsConfiguration) {
  await Services.ConfigurationService().setConfiguration("scripts", data);
}
