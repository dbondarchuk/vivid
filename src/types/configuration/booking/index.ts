import { getTimeZones } from "@vvo/tzdb";
import { z } from "zod";
import {
  appointmentAddonsSchema,
  appointmentOptionSchema,
} from "../../booking/appointmentOption";
import { remindersSchema } from "../../reminders/reminder";
import { emailConfigurationSchema } from "./email";
import { fieldsSchema } from "./field";
import { shiftsSchema } from "./shift";
import { textMessagesConfigurationSchema } from "./textMessages";

export * from "./email";
export * from "./field";
export * from "./shift";
export * from "./textMessages";

export const timezones = getTimeZones();
const [firstTimezone, ...restTimezones] = timezones.map((tz) => tz.name);

export const generalBookingConfigurationSchema = z.object({
  ics: z.string().url("ICS must a valid URL to your calendar").optional(),
  maxWeeksInFuture: z.coerce
    .number()
    .min(2, "The minimum amount of weeks must be 2")
    .max(20, "The maximum amount of weeks must be 20")
    .optional(),
  minHoursBeforeBooking: z.coerce
    .number()
    .min(0, "The minimum amount of hours must be 0")
    .max(72, "The maximum amount of hours must be 72")
    .optional(),
  minAvailableTimeBeforeSlot: z.coerce
    .number()
    .min(0, "The minimum available time before time slot must be 0")
    .max(60, "The maximum available time before time slot must be 60")
    .optional(),
  minAvailableTimeAfterSlot: z.coerce
    .number()
    .min(0, "The minimum available time after time slot must be 0")
    .max(60, "The maximum available time after time slot must be 60")
    .optional(),
  slotStartMinuteStep: z.coerce
    .number()
    .min(1, "The minimum time slot step must be 1")
    .max(30, "The maximum time slot step must be 30")
    .optional(),
  timezone: z.enum([firstTimezone, ...restTimezones], {
    required_error: "Unknown time zone",
  }),
});

export const appointOptionsSchema = z
  .array(appointmentOptionSchema)
  .min(1, "Options are required");

export const bookingConfigurationSchema =
  generalBookingConfigurationSchema.merge(
    z.object({
      workHours: shiftsSchema,
      addons: appointmentAddonsSchema,
      fields: fieldsSchema,
      options: appointOptionsSchema,
      email: emailConfigurationSchema,
      textMessages: textMessagesConfigurationSchema,
      reminders: remindersSchema,
    })
  );

export type BookingConfiguration = z.infer<typeof bookingConfigurationSchema>;
