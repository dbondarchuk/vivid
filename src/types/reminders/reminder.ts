import { z } from "zod";
import { communicationChannels } from "../communication";

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
  weeks: z.coerce
    .number()
    .min(0, "Min amount of weeks is 0")
    .max(10, "Max amount of weeks is 10")
    .optional(),
  days: z.coerce
    .number()
    .min(0, "Min amount of days is 0")
    .max(31, "Max amount of days is 31")
    .optional(),
  hours: z.coerce
    .number()
    .min(0, "Min amount of hours is 0")
    .max(24 * 5, "Max amount of hours is 120")
    .optional(),
  minutes: z.coerce
    .number()
    .min(0, "Min amount of minutes is 0")
    .max(60 * 10, "Max amount of minutes is 600"),
});

export const reminderAtTimeSchema = z.object({
  type: reminderTypesEnum.extract(["atTime"]),
  weeks: z.coerce
    .number()
    .min(0, "Min amount of weeks is 0")
    .max(10, "Max amount of weeks is 10")
    .optional(),
  days: z.coerce
    .number()
    .min(0, "Min amount of days is 0")
    .max(31, "Max amount of days is 31"),
  time: z.object({
    hour: z.coerce
      .number()
      .min(0, "Hour should be between 0 and 23")
      .max(23, "Hour should be between 0 and 23"),
    minute: z.coerce
      .number()
      .min(0, "Minute should be between 0 and 59")
      .max(59, "Minute should be between 0 and 59"),
  }),
});

export const reminderEmailSchema = z.object({
  channel: reminderChannelesEnum.extract(["email"]),
  body: z.string().min(1, "Email body is required"),
  subject: z.string().min(1, "Email subject is required"),
});

export const reminderSmsSchema = z.object({
  channel: reminderChannelesEnum.extract(["sms"]),
  body: z.string().min(1, "SMS body is required"),
});

export const reminderTypeSchema = z.discriminatedUnion("type", [
  reminderTimeBeforeSchema,
  reminderAtTimeSchema,
]);

export const reminderChannelSchema = z.discriminatedUnion("channel", [
  reminderEmailSchema,
  reminderSmsSchema,
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
export type SmsChannelReminder = z.infer<typeof reminderSmsSchema>;

export type Reminder = z.infer<typeof reminderSchema>;
export type Reminders = z.infer<typeof remindersSchema>;
