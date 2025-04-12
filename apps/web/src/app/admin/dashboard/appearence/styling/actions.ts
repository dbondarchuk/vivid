"use server";

import { ServicesContainer } from "@vivid/services";
import { StylingConfiguration } from "@vivid/types";

export async function updateStylingConfiguration(data: StylingConfiguration) {
  await ServicesContainer.ConfigurationService().setConfiguration(
    "styling",
    data
  );
}
