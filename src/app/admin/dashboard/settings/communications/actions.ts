"use server";

import { Services } from "@/lib/services";
import { CommunicationsConfiguration } from "@/types";

export async function updateCommunicationsConfiguration(
  data: CommunicationsConfiguration
) {
  await Services.ConfigurationService().setConfiguration(
    "communications",
    data
  );
}
