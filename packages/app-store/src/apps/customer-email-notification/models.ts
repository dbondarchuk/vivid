import { appointmentStatuses, zStrictRecord } from "@vivid/types";
import { z } from "zod";

export const eventConfigurationSchema = z.object({
  summary: z
    .string({ message: "Event summary template is required" })
    .min(1, "Event summary template is required"),
  templateId: z
    .string({ message: "Event template is required" })
    .min(1, "Event template is required"),
});

export type EventConfiguration = z.infer<typeof eventConfigurationSchema>;

const emailTemplateSchema = z.object({
  subject: z
    .string({ message: "Email subject template is required" })
    .min(1, "Email subject template is required"),
  templateId: z
    .string({ message: "Email template is required" })
    .min(1, "Email template is required"),
});

export type EmailTemplateConfiguration = z.infer<typeof emailTemplateSchema>;

export const emailTemplateKeys = z.enum([
  ...appointmentStatuses,
  "rescheduled",
]);

export type EmailTemplateKeys = z.infer<typeof emailTemplateKeys>;

export const emailTemplatesSchema = zStrictRecord(
  emailTemplateKeys,
  emailTemplateSchema
);

export type EmailTemplates = z.infer<typeof emailTemplatesSchema>;

export const customerEmailNotificationConfigurationSchema = z.object({
  templates: emailTemplatesSchema,
  event: eventConfigurationSchema,
});

export type CustomerEmailNotificationConfiguration = z.infer<
  typeof customerEmailNotificationConfigurationSchema
>;
