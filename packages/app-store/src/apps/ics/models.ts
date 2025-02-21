import { z } from "zod";

export const icsLinkCalendarSourceSchema = z.object({
  link: z.string().url("ICS must a valid URL to your calendar"),
});

export type IcsLinkCalendarSource = z.infer<typeof icsLinkCalendarSourceSchema>;
