import { z } from "zod";

export const textBeltConfigurationSchema = z.object({
  apiKey: z.string().min(1, "TextBelt API key is required"),
  autoReply: z.string().optional(),
});

export type TextBeltConfiguration = z.infer<typeof textBeltConfigurationSchema>;
