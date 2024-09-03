"use server";

import { Services } from "@/lib/services";
import { SocialConfiguration } from "@/types";

export async function updateSocialConfiguration(data: SocialConfiguration) {
  await Services.ConfigurationService().setConfiguration("social", data);
}
