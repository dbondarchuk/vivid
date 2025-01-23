import { zStrictRecord } from "@/lib/schema";
import { appointmentStatuses } from "@/types";
import { z } from "zod";

export const textMessagesTemplateSchema = z.object({
  body: z.string().optional(),
});

export type TextMessageTemplateConfiguration = z.infer<
  typeof textMessagesTemplateSchema
>;

export const textMessagesTemplateKeys = z.enum([
  ...appointmentStatuses,
  "rescheduled",
]);
export type TextMessagesTemplateKeys = z.infer<typeof textMessagesTemplateKeys>;

export const textMessagesTemplatesSchema = zStrictRecord(
  textMessagesTemplateKeys,
  textMessagesTemplateSchema
);

export const textMessagesConfigurationSchema = z.object({
  phoneField: z
    .array(z.string().min(1, "Phone field must not be empty"))
    .optional(),
  sendNewRequestNotifications: z.coerce.boolean().optional(),
  templates: textMessagesTemplatesSchema,
});

export type TextMessagesConfiguration = z.infer<
  typeof textMessagesConfigurationSchema
>;
