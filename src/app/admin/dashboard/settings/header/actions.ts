"use server";

import { Services } from "@/lib/services";
import { HeaderConfiguration } from "@/types";

export async function updateHeaderConfiguration(data: HeaderConfiguration) {
  await Services.ConfigurationService().setConfiguration("header", data);
}
