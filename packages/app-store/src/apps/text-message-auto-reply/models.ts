import { z } from "zod";

export const textMessageAutoReplyConfigurationSchema = z.object({
  autoReplyTemplateId: z.string().min(1, "Template is required"),
});

export type TextMessageAutoReplyConfiguration = z.infer<
  typeof textMessageAutoReplyConfigurationSchema
>;
