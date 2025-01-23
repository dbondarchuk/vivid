import { z } from "zod";

export const caldavCalendarSourceSchema = z.object({
  serverUrl: z.string().url("CalDAV server must a valid URL"),
  username: z.string().optional(),
  password: z.string().optional(),
});

export type CaldavCalendarSource = z.infer<typeof caldavCalendarSourceSchema>;
