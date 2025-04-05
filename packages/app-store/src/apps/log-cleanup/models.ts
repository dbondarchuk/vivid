import { z } from "zod";

export const cleanUpIntervalType = z.enum(["days", "weeks", "months"]);
export type CleanUpIntervalType = z.infer<typeof cleanUpIntervalType>;

export const logCleanupConfigurationSchema = z.object({
  amount: z.coerce
    .number()
    .min(1, "Amount must be at least 1")
    .int("Should be the integer value"),
  type: cleanUpIntervalType,
});

export type LogCleanupConfiguration = z.infer<
  typeof logCleanupConfigurationSchema
>;
