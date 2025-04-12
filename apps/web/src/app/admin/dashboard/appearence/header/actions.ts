"use server";
import { ServicesContainer } from "@vivid/services";
import { HeaderConfiguration } from "@vivid/types";

export async function updateHeaderConfiguration(data: HeaderConfiguration) {
  await ServicesContainer.ConfigurationService().setConfiguration(
    "header",
    data
  );
}
