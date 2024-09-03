"use server";

import { Services } from "@/lib/services";
import { GeneralConfiguration } from "@/types";

export async function updateGeneralConfiguration(data: GeneralConfiguration) {
  await Services.ConfigurationService().setConfiguration("general", data);
}
