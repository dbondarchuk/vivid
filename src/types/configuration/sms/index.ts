import { z } from "zod";

export const smsConfigurationSchema = z.object({
  authToken: z.string().min(1, { message: "Auth token is required" }),
  autoReply: z.string().optional(),
});

export type SmsConfiguration = z.infer<typeof smsConfigurationSchema>;
