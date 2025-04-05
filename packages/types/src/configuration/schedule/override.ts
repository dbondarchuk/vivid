import { z } from "zod";
import { shiftsSchema } from "./shifts";

export const scheduleOverrideSchema = z.object({
  week: z.coerce
    .number()
    .int("Should be the integer value")
    .positive("Must be a valid week"),
  schedule: shiftsSchema,
});

export type ScheduleOverride = z.infer<typeof scheduleOverrideSchema>;
