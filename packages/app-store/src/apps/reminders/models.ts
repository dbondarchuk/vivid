import {
  asOptinalNumberField,
  CommunicationChannel,
  communicationChannels,
  Query,
  WithDatabaseId,
} from "@vivid/types";
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
      .int("common.number.integer")
      .min(0, "reminders.form.weeks.min")
      .max(10, "reminders.form.weeks.max")
  ),
  days: asOptinalNumberField(
    z.coerce
      .number()
      .int("common.number.integer")
      .min(0, "reminders.form.days.min")
      .max(31, "reminders.form.days.max")
  ),
  hours: asOptinalNumberField(
    z.coerce
      .number()
      .int("common.number.integer")
      .min(0, "reminders.form.hours.min")
      .max(24 * 5, "reminders.form.hours.max")
  ),
  minutes: asOptinalNumberField(
    z.coerce
      .number()
      .int("common.number.integer")
      .min(0, "reminders.form.minutes.min")
      .max(60 * 10, "reminders.form.minutes.max")
  ),
});

export const reminderAtTimeSchema = z.object({
  type: reminderTypesEnum.extract(["atTime"]),
  weeks: asOptinalNumberField(
    z.coerce
      .number()
      .int("common.number.integer")
      .min(0, "reminders.form.weeks.min")
      .max(10, "reminders.form.weeks.max")
  ),
  days: z.coerce
    .number()
    .int("common.number.integer")
    .min(0, "reminders.form.days.min")
    .max(31, "reminders.form.days.max"),
  time: z.object({
    hour: z.coerce
      .number()
      .int("common.number.integer")
      .min(0, "reminders.form.time.hour.min")
      .max(23, "reminders.form.time.hour.max"),
    minute: z.coerce
      .number()
      .int("common.number.integer")
      .min(0, "reminders.form.time.minute.min")
      .max(59, "reminders.form.time.minute.max"),
  }),
});

export const baseReminderChannelSchema = z.object({
  templateId: z
    .string({ message: "reminders.form.templateId.required" })
    .min(1, "reminders.form.templateId.required"),
});

export const reminderEmailSchema = z
  .object({
    channel: reminderChannelesEnum.extract(["email"]),
    subject: z.string().min(1, "reminders.form.subject.required"),
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
  name: z.string().min(2, "reminders.form.name.min"),
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
        message: "reminders.form.atTime.days.min",
      });
    } else if (
      arg.type === "timeBefore" &&
      !arg.weeks &&
      !arg.days &&
      !arg.hours &&
      !arg.minutes
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["minutes"],
        message: "reminders.form.atTime.minutes.min",
      });
    }
  });

export const getReminderSchemaWithUniqueCheck = (
  uniqueNameCheckFn: (name: string) => Promise<boolean>,
  message: string
) => {
  return reminderSchema.superRefine(async (args, ctx) => {
    const isUnique = await uniqueNameCheckFn(args.name);
    if (!isUnique) {
      ctx.addIssue({
        code: "custom",
        path: ["name"],
        message,
      });
    }
  });
};

export const remindersSchema = z.array(reminderSchema).optional();

export type TimeBeforeReminder = z.infer<typeof reminderTimeBeforeSchema>;
export type AtTimeReminder = z.infer<typeof reminderAtTimeSchema>;

export type EmailChannelReminder = z.infer<typeof reminderEmailSchema>;
export type TextMessageChannelReminder = z.infer<
  typeof reminderTextMessageSchema
>;

export type ReminderUpdateModel = z.infer<typeof reminderSchema>;

export type Reminder = WithDatabaseId<ReminderUpdateModel> & {
  appId: string;
  updatedAt: Date;
};

export type GetRemindersAction = {
  query: Query & {
    channel?: CommunicationChannel[];
  };
};

export const GetRemindersActionType = "get-reminders" as const;

export type GetReminderAction = {
  id: string;
};

export const GetReminderActionType = "get-reminder" as const;

export type DeleteRemindersAction = {
  ids: string[];
};

export const DeleteRemindersActionType = "delete-reminders" as const;

export type CreateNewReminderAction = {
  reminder: ReminderUpdateModel;
};

export const CreateNewReminderActionType = "create-reminder" as const;

export type UpdateReminderAction = {
  id: string;
  update: ReminderUpdateModel;
};

export const UpdateReminderActionType = "update-reminder" as const;

export type CheckUniqueReminderNameAction = {
  id?: string;
  name: string;
};

export const CheckUniqueReminderNameActionType = "check-unique-name" as const;

export const remindersAppDataSchema = z.object({});

export type RemindersAppData = z.infer<typeof remindersAppDataSchema>;

export type GetAppDataAction = {};

export const GetAppDataActionType = "get-app-data" as const;

export type SetAppDataAction = {
  data: RemindersAppData;
};

export const SetAppDataActionType = "set-app-data" as const;

export type RequestAction =
  | ({
      type: typeof GetRemindersActionType;
    } & GetRemindersAction)
  | ({
      type: typeof GetReminderActionType;
    } & GetReminderAction)
  | ({
      type: typeof DeleteRemindersActionType;
    } & DeleteRemindersAction)
  | ({
      type: typeof CreateNewReminderActionType;
    } & CreateNewReminderAction)
  | ({
      type: typeof UpdateReminderActionType;
    } & UpdateReminderAction)
  | ({
      type: typeof CheckUniqueReminderNameActionType;
    } & CheckUniqueReminderNameAction)
  | ({
      type: typeof GetAppDataActionType;
    } & GetAppDataAction)
  | ({
      type: typeof SetAppDataActionType;
    } & SetAppDataAction);

// export type Reminders = z.infer<typeof remindersSchema>;

// export const remindersConfigurationSchema = z.object({
//   reminders: remindersSchema,
// });

// export type RemindersConfiguration = z.infer<
//   typeof remindersConfigurationSchema
// >;
