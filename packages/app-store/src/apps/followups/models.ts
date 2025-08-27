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
      .int("common.number.integer")
      .min(0, "followUps.form.weeks.min")
      .max(10, "followUps.form.weeks.max"),
  ),
  days: asOptinalNumberField(
    z.coerce
      .number()
      .int("common.number.integer")
      .min(0, "followUps.form.days.min")
      .max(31, "followUps.form.days.max"),
  ),
  hours: asOptinalNumberField(
    z.coerce
      .number()
      .int("common.number.integer")
      .min(0, "followUps.form.hours.min")
      .max(24 * 5, "followUps.form.hours.max"),
  ),
  minutes: asOptinalNumberField(
    z.coerce
      .number()
      .int("common.number.integer")
      .min(0, "followUps.form.minutes.min")
      .max(60 * 10, "followUps.form.minutes.max"),
  ),
});

export const followUpAtTimeSchema = z.object({
  type: followUpTypesEnum.extract(["atTime"]),
  weeks: asOptinalNumberField(
    z.coerce
      .number()
      .int("common.number.integer")
      .min(0, "followUps.form.weeks.min")
      .max(10, "followUps.form.weeks.max"),
  ),
  days: z.coerce
    .number()
    .int("common.number.integer")
    .min(0, "followUps.form.days.min")
    .max(31, "followUps.form.days.max"),
  time: z.object({
    hour: z.coerce
      .number()
      .int("common.number.integer")
      .min(0, "followUps.form.time.hour.min")
      .max(23, "followUps.form.time.hour.max"),
    minute: z.coerce
      .number()
      .int("common.number.integer")
      .min(0, "followUps.form.time.minute.min")
      .max(59, "followUps.form.time.minute.max"),
  }),
});

export const baseFollowUpChannelSchema = z.object({
  templateId: z
    .string({ message: "followUps.form.templateId.required" })
    .min(1, "followUps.form.templateId.required"),
});

export const followUpEmailSchema = z
  .object({
    channel: followUpChannelsEnum.extract(["email"]),
    subject: z.string().min(1, "followUps.form.subject.required"),
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
  name: z.string().min(2, "followUps.form.name.min"),
  // Optional setting to send follow-up after specific number of customer appointments
  afterAppointmentCount: asOptinalNumberField(
    z.coerce
      .number()
      .int("common.number.integer")
      .min(1, "followUps.form.afterAppointmentCount.min")
      .max(100, "followUps.form.afterAppointmentCount.max"),
  ),
});

export const followUpSchema = z
  .intersection(
    z.intersection(followUpGeneralSchema, followUpTypeSchema),
    followUpChannelSchema,
  )
  .superRefine((arg, ctx) => {
    if (arg.type === "atTime" && !arg.weeks && !arg.days) {
      ctx.addIssue({
        code: "custom",
        path: ["days"],
        message: "followUps.form.atTime.days.min",
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
        message: "followUps.form.atTime.minutes.min",
      });
    }
  });

export const getFollowUpSchemaWithUniqueCheck = (
  uniqueNameCheckFn: (name: string) => Promise<boolean>,
  message: string,
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
