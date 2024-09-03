"use server";

import { Services } from "@/lib/services";
import { FooterConfiguration } from "@/types";

export async function updateFooterConfiguration(data: FooterConfiguration) {
  await Services.ConfigurationService().setConfiguration("footer", data);
}
