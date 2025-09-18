"use server";

import { ServicesContainer } from "@vivid/services";
import { ScriptsConfiguration } from "@vivid/types";

export async function updateScriptsConfiguration(data: ScriptsConfiguration) {
  await ServicesContainer.ConfigurationService().setConfiguration(
    "scripts",
    data,
  );
}
