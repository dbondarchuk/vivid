import { asOptionalField } from "@vivid/types";
import { z } from "zod";

export const emailNotificationConfigurationSchema = z.object({
  email: asOptionalField(z.string().email("Invalid email")),
});

export type EmailNotificationConfiguration = z.infer<
  typeof emailNotificationConfigurationSchema
>;
