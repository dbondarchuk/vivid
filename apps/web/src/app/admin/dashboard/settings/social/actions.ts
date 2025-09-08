"use server";

import { ServicesContainer } from "@vivid/services";
import { SocialConfiguration } from "@vivid/types";

export async function updateSocialConfiguration(data: SocialConfiguration) {
  await ServicesContainer.ConfigurationService().setConfiguration(
    "social",
    data,
  );
}
