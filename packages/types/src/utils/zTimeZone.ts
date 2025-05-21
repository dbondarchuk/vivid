import { getTimeZones } from "@vvo/tzdb";
import z from "zod";

export const timeZones = getTimeZones();
const [firstTimezone, ...restTimezones] = timeZones.map((tz) => tz.name);

export const zTimeZone = z.enum([firstTimezone, ...restTimezones], {
  required_error: "Unknown time zone",
});
