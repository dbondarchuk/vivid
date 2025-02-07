import { z } from "zod";
import { zOptionalOrMinLengthString } from "../../utils";
import { menuItemsSchema } from "./menuItem";

export const footerConfigurationSchema = z.discriminatedUnion("isCustom", [
  z.object({
    content: z.string().optional(),
    isCustom: z.literal(true),
  }),
  z.object({
    contactUsLabel: zOptionalOrMinLengthString(
      2,
      "Label must contain at least 2 symbols"
    ),
    links: menuItemsSchema.optional(),
    isCustom: z.literal(false),
  }),
]);

export type FooterConfiguration = z.infer<typeof footerConfigurationSchema>;
