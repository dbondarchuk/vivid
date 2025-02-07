import { z } from "zod";

export const caldavCalendarSourceSchema = z.object({
  serverUrl: z.string().url("CalDAV server must a valid URL"),
  calendarName: z
    .string({ message: "CalDAV Calendar name is required" })
    .min(1, "CalDAV Calendar name is required"),
  username: z.string().optional(),
  password: z.string().optional(),
});

export type CaldavCalendarSource = z.infer<typeof caldavCalendarSourceSchema>;
