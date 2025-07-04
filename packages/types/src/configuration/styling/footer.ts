import { z } from "zod";
import { zOptionalOrMinLengthString } from "../../utils";
import { menuItemsSchema } from "./menu-item";

export const footerConfigurationSchema = z.discriminatedUnion("isCustom", [
  z.object({
    content: z.string().optional(),
    isCustom: z.literal(true),
  }),
  z.object({
    contactUsLabel: zOptionalOrMinLengthString(
      2,
      "configuration.styling.footer.contactUsLabel.min"
    ),
    links: menuItemsSchema.optional(),
    isCustom: z.literal(false),
  }),
]);

export type FooterConfiguration = z.infer<typeof footerConfigurationSchema>;
