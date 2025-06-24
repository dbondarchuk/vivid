import { asOptionalField, zPhone } from "@vivid/types";
import { z } from "zod";

export const textMessageResenderConfigurationSchema = z.object({
  phone: asOptionalField(zPhone),
});

export type TextMessageResenderConfiguration = z.infer<
  typeof textMessageResenderConfigurationSchema
>;
