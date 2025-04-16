import { z } from "zod";

export const calendarWriterConfigurationSchema = z.object({
  appId: z.string().min(1, "Calendar app is required"),
});

export type CalendarWriterConfiguration = z.infer<
  typeof calendarWriterConfigurationSchema
>;
