"use server";

import { Services } from "@/lib/services";
import { BookingConfiguration } from "@/types";

export async function updateBookingConfiguration(data: BookingConfiguration) {
  await Services.ConfigurationService().setConfiguration("booking", data);
}
