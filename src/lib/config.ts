import { ConfigurationService } from "@/services/configurationService";
import { cache } from "react";

export const revalidate = 10; // 10 seconds

export const getConfiguration = cache(async () => {
  const config = await new ConfigurationService().getConfiguration();
  return config;
});
