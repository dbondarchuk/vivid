import { z } from "zod";
import { menuItemsSchema } from "./menuItem";

export const headerConfigurationSchema = z.object({
  menu: menuItemsSchema,
  showLogo: z.coerce.boolean().default(false).optional(),
});

export type HeaderConfiguration = z.infer<typeof headerConfigurationSchema>;
