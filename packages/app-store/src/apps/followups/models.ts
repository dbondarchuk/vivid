import {
  asOptinalNumberField,
  CommunicationChannel,
  communicationChannels,
  Query,
  WithDatabaseId,
} from "@vivid/types";
import { z } from "zod";

export const timeAfterFollowUpType = "timeAfter" as const;
export const atTimeFollowUpType = "atTime" as const;
export const followUpTypes = [
  timeAfterFollowUpType,
  atTimeFollowUpType,
] as const;

export type FollowUpType = (typeof followUpTypes)[number];

export const followUpTypesEnum = z.enum(followUpTypes);
export const followUpChannelsEnum = z.enum(communicationChannels);

export const followUpTimeAfterSchema = z.object({
  type: followUpTypesEnum.extract(["timeAfter"]),
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

export const followUpAtTimeSchema = z.object({
  type: followUpTypesEnum.extract(["atTime"]),
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
    .max(31, "Min amount of days is 31"),
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

export const baseFollowUpChannelSchema = z.object({
  templateId: z
    .string({ message: "Template is required" })
    .min(1, "Template is required"),
});

export const followUpEmailSchema = z
  .object({
    channel: followUpChannelsEnum.extract(["email"]),
    subject: z.string().min(1, "Email subject is required"),
  })
  .merge(baseFollowUpChannelSchema);

export const followUpTextMessageSchema = z
  .object({
    channel: followUpChannelsEnum.extract(["text-message"]),
  })
  .merge(baseFollowUpChannelSchema);

export const followUpTypeSchema = z.discriminatedUnion("type", [
  followUpTimeAfterSchema,
  followUpAtTimeSchema,
]);

export const followUpChannelSchema = z.discriminatedUnion("channel", [
  followUpEmailSchema,
  followUpTextMessageSchema,
]);

export const followUpGeneralSchema = z.object({
  name: z.string().min(2, "Follow-up name must be at least 2 characters long"),
  // Optional setting to send follow-up after specific number of customer appointments
  afterAppointmentCount: asOptinalNumberField(
    z.coerce
      .number()
      .int("Should be the integer value")
      .min(1, "Min appointment count is 1")
      .max(100, "Max appointment count is 100")
  ),
});

export const followUpSchema = z
  .intersection(
    z.intersection(followUpGeneralSchema, followUpTypeSchema),
    followUpChannelSchema
  )
  .superRefine((arg, ctx) => {
    if (arg.type === "atTime" && !arg.weeks && !arg.days) {
      ctx.addIssue({
        code: "custom",
        path: ["days"],
        message:
          "Follow-up should be sent at least 1 day after the appointment",
      });
    } else if (
      arg.type === "timeAfter" &&
      !arg.weeks &&
      !arg.days &&
      !arg.hours &&
      !arg.minutes
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["minutes"],
        message:
          "Follow-up should be sent at least 1 minute after the appointment",
      });
    }
  });

export const getFollowUpSchemaWithUniqueCheck = (
  uniqueNameCheckFn: (name: string) => Promise<boolean>,
  message: string
) => {
  return followUpSchema.superRefine(async (args, ctx) => {
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

export const followUpsSchema = z.array(followUpSchema).optional();

export type TimeAfterFollowUp = z.infer<typeof followUpTimeAfterSchema>;
export type AtTimeFollowUp = z.infer<typeof followUpAtTimeSchema>;

export type EmailChannelFollowUp = z.infer<typeof followUpEmailSchema>;
export type TextMessageChannelFollowUp = z.infer<
  typeof followUpTextMessageSchema
>;

export type FollowUpUpdateModel = z.infer<typeof followUpSchema>;

export type FollowUp = WithDatabaseId<FollowUpUpdateModel> & {
  appId: string;
  updatedAt: Date;
};

export type GetFollowUpsAction = {
  query: Query & {
    channel?: CommunicationChannel[];
  };
};

export const GetFollowUpsActionType = "get-follow-ups" as const;

export type GetFollowUpAction = {
  id: string;
};

export const GetFollowUpActionType = "get-follow-up" as const;

export type DeleteFollowUpsAction = {
  ids: string[];
};

export const DeleteFollowUpsActionType = "delete-follow-ups" as const;

export type CreateNewFollowUpAction = {
  followUp: FollowUpUpdateModel;
};

export const CreateNewFollowUpActionType = "create-follow-up" as const;

export type UpdateFollowUpAction = {
  id: string;
  update: FollowUpUpdateModel;
};

export const UpdateFollowUpActionType = "update-follow-up" as const;

export type CheckUniqueFollowUpNameAction = {
  id?: string;
  name: string;
};

export const CheckUniqueFollowUpNameActionType =
  "check-unique-follow-up-name" as const;

export const followUpsAppDataSchema = z.object({});

export type FollowUpsAppData = z.infer<typeof followUpsAppDataSchema>;

export type GetAppDataAction = {};

export const GetAppDataActionType = "get-app-data" as const;

export type SetAppDataAction = {
  data: FollowUpsAppData;
};

export const SetAppDataActionType = "set-app-data" as const;

export type RequestAction =
  | ({
      type: typeof GetFollowUpsActionType;
    } & GetFollowUpsAction)
  | ({
      type: typeof GetFollowUpActionType;
    } & GetFollowUpAction)
  | ({
      type: typeof DeleteFollowUpsActionType;
    } & DeleteFollowUpsAction)
  | ({
      type: typeof CreateNewFollowUpActionType;
    } & CreateNewFollowUpAction)
  | ({
      type: typeof UpdateFollowUpActionType;
    } & UpdateFollowUpAction)
  | ({
      type: typeof CheckUniqueFollowUpNameActionType;
    } & CheckUniqueFollowUpNameAction)
  | ({
      type: typeof GetAppDataActionType;
    } & GetAppDataAction)
  | ({
      type: typeof SetAppDataActionType;
    } & SetAppDataAction);
