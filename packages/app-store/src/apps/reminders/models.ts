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
  minutes: asOptinalNumberField(
    z.coerce
      .number()
      .int("Should be the integer value")
      .min(0, "Min amount of minutes is 0")
      .max(60 * 10, "Max amount of minutes is 600")
  ),
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
        message:
          "Reminder should be sent at least 1 minute before the appointment",
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
