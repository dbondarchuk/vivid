import { appointmentStatuses, zStrictRecord } from "@vivid/types";
import { z } from "zod";

export const textMessagesTemplateSchema = z.object({
  templateId: z.string().optional(),
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
  textMessagesTemplateSchema,
);

export const customerTextMessageNotificationConfigurationSchema = z.object({
  sendNewRequestNotifications: z.coerce.boolean().optional(),
  templates: textMessagesTemplatesSchema,
});

export type CustomerTextMessageNotificationConfiguration = z.infer<
  typeof customerTextMessageNotificationConfigurationSchema
>;
