import { z } from "zod";

export const textMessageResenderConfigurationSchema = z.object({
  phone: z
    .string()
    .refine((s) => !s?.includes("_"), "Invalid phone number")
    .optional(),
});

export type TextMessageResenderConfiguration = z.infer<
  typeof textMessageResenderConfigurationSchema
>;
