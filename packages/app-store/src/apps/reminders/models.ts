import { asOptinalNumberField, communicationChannels } from "@vivid/types";
import { z } from "zod";

export const timeBeforeReminderType = "timeBefore" as const;
export const atTimeReminderType = "atTime" as const;
export const reminderTypes = [
  timeBeforeReminderType,
  atTimeReminderType,
] as const;

export type ReminderType = (typeof reminderTypes)[number];

export const reminderTypesEnum = z.enum(reminderTypes);
export const reminderChannelesEnum = z.enum(communicationChannels);

export const reminderTimeBeforeSchema = z.object({
  type: reminderTypesEnum.extract(["timeBefore"]),
  weeks: asOptinalNumberField(
    z.coerce
      .number()
      .int("Should be the integer value")
      .min(0, "Min amount of weeks is 0")
      .max(10, "Max amount of weeks is 10")
  ),
  days: asOptinalNumberField(
    z.coerce
      .number()
      .int("Should be the integer value")
      .min(0, "Min amount of days is 0")
      .max(31, "Max amount of days is 31")
  ),
  hours: asOptinalNumberField(
    z.coerce
      .number()
      .int("Should be the integer value")
      .min(0, "Min amount of hours is 0")
      .max(24 * 5, "Max amount of hours is 120")
  ),
  minutes: z.coerce
    .number()
    .int("Should be the integer value")
    .min(0, "Min amount of minutes is 0")
    .max(60 * 10, "Max amount of minutes is 600"),
});

export const reminderAtTimeSchema = z.object({
  type: reminderTypesEnum.extract(["atTime"]),
  weeks: asOptinalNumberField(
    z.coerce
      .number()
      .int("Should be the integer value")
      .min(0, "Min amount of weeks is 0")
      .max(10, "Max amount of weeks is 10")
  ),
  days: z.coerce
    .number()
    .int("Should be the integer value")
    .min(0, "Min amount of days is 0")
    .max(31, "Max amount of days is 31"),
  time: z.object({
    hour: z.coerce
      .number()
      .int("Should be the integer value")
      .min(0, "Hour should be between 0 and 23")
      .max(23, "Hour should be between 0 and 23"),
    minute: z.coerce
      .number()
      .int("Should be the integer value")
      .min(0, "Minute should be between 0 and 59")
      .max(59, "Minute should be between 0 and 59"),
  }),
});

export const baseReminderChannelSchema = z.object({
  templateId: z
    .string({ message: "Template is required" })
    .min(1, "Template is required"),
});

export const reminderEmailSchema = z
  .object({
    channel: reminderChannelesEnum.extract(["email"]),
    subject: z.string().min(1, "Email subject is required"),
  })
  .merge(baseReminderChannelSchema);

export const reminderTextMessageSchema = z
  .object({
    channel: reminderChannelesEnum.extract(["text-message"]),
  })
  .merge(baseReminderChannelSchema);

export const reminderTypeSchema = z.discriminatedUnion("type", [
  reminderTimeBeforeSchema,
  reminderAtTimeSchema,
]);

export const reminderChannelSchema = z.discriminatedUnion("channel", [
  reminderEmailSchema,
  reminderTextMessageSchema,
]);

export const reminderGeneralSchema = z.object({
  name: z.string().min(2, "Reminder name must me at least 2 characters long"),
  id: z.string(),
});

export const reminderSchema = z
  .intersection(
    z.intersection(reminderGeneralSchema, reminderTypeSchema),
    reminderChannelSchema
  )
  .superRefine((arg, ctx) => {
    if (arg.type === "atTime" && !arg.weeks && !arg.days) {
      ctx.addIssue({
        code: "custom",
        path: ["days"],
        message:
          "Reminder should be sent at least 1 day before the appointment",
      });
    }
  });

export const remindersSchema = z.array(reminderSchema).optional();

export type TimeBeforeReminder = z.infer<typeof reminderTimeBeforeSchema>;
export type AtTimeReminder = z.infer<typeof reminderAtTimeSchema>;

export type EmailChannelReminder = z.infer<typeof reminderEmailSchema>;
export type TextMessageChannelReminder = z.infer<
  typeof reminderTextMessageSchema
>;

export type Reminder = z.infer<typeof reminderSchema>;
export type Reminders = z.infer<typeof remindersSchema>;

export const remindersConfigurationSchema = z.object({
  reminders: remindersSchema,
});

export type RemindersConfiguration = z.infer<
  typeof remindersConfigurationSchema
>;
