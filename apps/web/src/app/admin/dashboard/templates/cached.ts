import { ServicesContainer } from "@vivid/services";
import { cache } from "react";

export const getTemplate = cache(async (id: string) => {
  return await ServicesContainer.TemplatesService().getTemplate(id);
});
