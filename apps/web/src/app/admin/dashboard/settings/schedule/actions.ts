"use server";

import { ServicesContainer } from "@vivid/services";
import { ScheduleConfiguration } from "@vivid/types";

export async function updateScheduleConfiguration(data: ScheduleConfiguration) {
  await ServicesContainer.ConfigurationService().setConfiguration(
    "schedule",
    data
  );
}
