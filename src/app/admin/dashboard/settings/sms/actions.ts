"use server";

import { Services } from "@/lib/services";
import { SmsConfiguration } from "@/types";

export async function updateSmsConfiguration(data: SmsConfiguration) {
  await Services.ConfigurationService().setConfiguration("sms", data);
}
