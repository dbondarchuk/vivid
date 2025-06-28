import { z } from "zod";

export const caldavCalendarSourceSchema = z.object({
  serverUrl: z.string().url("calDav.serverUrl.url"),
  calendarName: z
    .string({ message: "calDav.calendarName.required" })
    .min(1, "calDav.calendarName.required"),
  username: z.string().optional(),
  password: z.string().optional(),
});

export type CaldavCalendarSource = z.infer<typeof caldavCalendarSourceSchema>;
