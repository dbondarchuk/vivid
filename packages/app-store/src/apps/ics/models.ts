import { z } from "zod";

export const icsLinkCalendarSourceSchema = z.object({
  link: z.string().url("ics.invalidUrl"),
});

export type IcsLinkCalendarSource = z.infer<typeof icsLinkCalendarSourceSchema>;
