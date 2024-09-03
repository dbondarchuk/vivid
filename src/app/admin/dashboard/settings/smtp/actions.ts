"use server";

import { Services } from "@/lib/services";
import { SmtpConfiguration } from "@/types";
import { maskedPassword } from "./constants";

export async function updateSmtpConfiguration(data: SmtpConfiguration) {
  if (data.auth.pass === maskedPassword) {
    data.auth.pass = (
      await Services.ConfigurationService().getConfiguration("smtp")
    ).auth.pass;
  }

  await Services.ConfigurationService().setConfiguration("smtp", data);
}
