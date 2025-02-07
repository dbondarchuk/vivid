"use server";

import { ServicesContainer } from "@vivid/services";
import { FooterConfiguration } from "@vivid/types";

export async function updateFooterConfiguration(data: FooterConfiguration) {
  await ServicesContainer.ConfigurationService().setConfiguration(
    "footer",
    data
  );
}
