import { z } from "zod";

export const communicationsConfigurationSchema = z.object({
  email: z.object({
    appId: z.string().min(1, "Email sender APP is required"),
    data: z.any().optional(),
  }),
  textMessage: z
    .object({
      appId: z.string().optional(),
      data: z.any().optional(),
    })
    .optional(),
});

export type CommunicationsConfiguration = z.infer<
  typeof communicationsConfigurationSchema
>;
