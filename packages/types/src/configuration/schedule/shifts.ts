import { z } from "zod";
import { parseTime, zUniqueArray } from "../../utils";

export const timeSchema = z.string().refine((x) => {
  try {
    const result = parseTime(x);
    return (
      result.hour >= 0 &&
      result.hour <= 23 &&
      result.minute >= 0 &&
      result.minute <= 59
    );
  } catch {
    return false;
  }
}, "Must be a valid time in format HH:mm");

export const shiftsSchema = zUniqueArray(
  z.array(
    z.object({
      weekDay: z
        .number()
        .min(1, "Week day must start from 1 for Monday")
        .max(7, "Week day must not be larger than 7 for Sunday"),
      shifts: z.array(
        z.object({
          start: timeSchema,
          end: timeSchema,
        })
      ),
    })
  ),
  (obj) => obj.weekDay
);
