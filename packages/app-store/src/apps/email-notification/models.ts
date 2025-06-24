import { asOptionalField, zEmail } from "@vivid/types";
import { z } from "zod";

export const emailNotificationConfigurationSchema = z.object({
  email: asOptionalField(zEmail),
});

export type EmailNotificationConfiguration = z.infer<
  typeof emailNotificationConfigurationSchema
>;
