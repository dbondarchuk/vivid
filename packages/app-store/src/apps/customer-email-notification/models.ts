import { appointmentStatuses, zStrictRecord } from "@vivid/types";
import { z } from "zod";

export const eventConfigurationSchema = z.object({
  summary: z
    .string({
      message: "customerEmailNotification.eventTemplate.summary.required",
    })
    .min(1, "customerEmailNotification.eventTemplate.summary.required"),
  templateId: z
    .string({
      message: "customerEmailNotification.eventTemplate.templateId.required",
    })
    .min(1, "customerEmailNotification.eventTemplate.templateId.required"),
});

export type EventConfiguration = z.infer<typeof eventConfigurationSchema>;

const emailTemplateSchema = z.object({
  subject: z
    .string({
      message: "customerEmailNotification.emailTemplate.subject.required",
    })
    .min(1, "customerEmailNotification.emailTemplate.subject.required"),
  templateId: z
    .string({
      message: "customerEmailNotification.emailTemplate.templateId.required",
    })
    .min(1, "customerEmailNotification.emailTemplate.templateId.required"),
});

export type EmailTemplateConfiguration = z.infer<typeof emailTemplateSchema>;

export const emailTemplateKeys = z.enum([
  ...appointmentStatuses,
  "rescheduled",
]);

export type EmailTemplateKeys = z.infer<typeof emailTemplateKeys>;

export const emailTemplatesSchema = zStrictRecord(
  emailTemplateKeys,
  emailTemplateSchema,
);

export type EmailTemplates = z.infer<typeof emailTemplatesSchema>;

export const customerEmailNotificationConfigurationSchema = z.object({
  templates: emailTemplatesSchema,
  event: eventConfigurationSchema,
});

export type CustomerEmailNotificationConfiguration = z.infer<
  typeof customerEmailNotificationConfigurationSchema
>;
