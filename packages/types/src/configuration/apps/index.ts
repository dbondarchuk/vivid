import { z } from "zod";

export const defaultAppsConfigurationSchema = z.object({
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
  assetsStorage: z.object({
    appId: z.string().min(1, "Asset Storage APP is required"),
    data: z.any().optional(),
  }),
});

export type DefaultAppsConfiguration = z.infer<
  typeof defaultAppsConfigurationSchema
>;
