import { z } from "zod";

export const textBeltConfigurationSchema = z.object({
  apiKey: z.string().min(1, "textBelt.apiKey.required"),
  textMessageResponderAppId: z.string().optional(),
});

export type TextBeltConfiguration = z.infer<typeof textBeltConfigurationSchema>;
