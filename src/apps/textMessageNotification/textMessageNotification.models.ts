import { z } from "zod";

export const textMessageNotificationConfigurationSchema = z.object({
  phone: z
    .string()
    .refine((s) => !s?.includes("_"), "Invalid phone number")
    .optional(),
});

export type TextMessageNotificationConfiguration = z.infer<
  typeof textMessageNotificationConfigurationSchema
>;
