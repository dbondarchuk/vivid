import { z } from "zod";

export const textMessageAutoReplyConfigurationSchema = z.object({
  autoReplyTemplateId: z
    .string()
    .min(1, "textMessageAutoReply.autoReplyTemplateId.required"),
});

export type TextMessageAutoReplyConfiguration = z.infer<
  typeof textMessageAutoReplyConfigurationSchema
>;
