import { asOptionalField, zPhone } from "@vivid/types";
import { z } from "zod";

export const textMessageNotificationConfigurationSchema = z.object({
  phone: asOptionalField(zPhone),
});

export type TextMessageNotificationConfiguration = z.infer<
  typeof textMessageNotificationConfigurationSchema
>;
