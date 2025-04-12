"use server";

import { ServicesContainer } from "@vivid/services";
import { GeneralConfiguration } from "@vivid/types";

export async function updateGeneralConfiguration(data: GeneralConfiguration) {
  await ServicesContainer.ConfigurationService().setConfiguration(
    "general",
    data
  );
}
