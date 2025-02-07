"use server";

import { ServicesContainer } from "@vivid/services";
import { BookingConfiguration } from "@vivid/types";

export async function updateBookingConfiguration(data: BookingConfiguration) {
  await ServicesContainer.ConfigurationService().setConfiguration(
    "booking",
    data
  );
}
