"use server";

import { Services } from "@/lib/services";
import { StylingConfiguration } from "@/types";

export async function updateStylingConfiguration(data: StylingConfiguration) {
  await Services.ConfigurationService().setConfiguration("styling", data);
}
