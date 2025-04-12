import { z } from "zod";
import { menuItemsWithSubMenuSchema } from "./menu-item";

export const headerShadowType = z.enum(["none", "static", "on-scroll"]);

export const headerConfigurationSchema = z.object({
  menu: menuItemsWithSubMenuSchema,
  showLogo: z.coerce.boolean().default(false).optional(),
  sticky: z.coerce.boolean().default(false).optional(),
  shadow: headerShadowType.optional(),
});

export type HeaderConfiguration = z.infer<typeof headerConfigurationSchema>;
