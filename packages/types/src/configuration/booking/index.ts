import { z } from "zod";
import { asOptinalNumberField, asOptionalField } from "../../utils";
import { zTimeZone } from "../../utils/zTimeZone";
import { calendarSourcesConfigurationSchema } from "./calendar-source";

export * from "../../booking/field";
export * from "./calendar-source";

export const customTimeSlotSchema = z
  .string({ message: "Time is required" })
  .refine((arg) => {
    const split = arg.split(":", 2).map((x) => parseInt(x));
    return !(
      isNaN(split[0]) ||
      split[0] < 0 ||
      split[0] >= 24 ||
      isNaN(split[1]) ||
      split[1] < 0 ||
      split[1] >= 60
    );
  }, "Invalid time");

export const generalBookingConfigurationSchema = z.object({
  maxWeeksInFuture: asOptinalNumberField(
    z.coerce
      .number()
      .int("Should be the integer value")
      .min(2, "The minimum amount of weeks must be 2")
      .max(20, "The maximum amount of weeks must be 20")
  ),
  minHoursBeforeBooking: asOptinalNumberField(
    z.coerce
      .number()
      .int("Should be the integer value")
      .min(0, "The minimum amount of hours must be 0")
      .max(72, "The maximum amount of hours must be 72")
  ),
  breakDuration: asOptinalNumberField(
    z.coerce
      .number()
      .int("Should be the integer value")
      .min(0, "The minimum break time should be 0")
      .max(120, "The maximum break time be 120")
  ),
  slotStart: z
    .union(
      [
        z.literal(5),
        z.literal(10),
        z.literal(15),
        z.literal(20),
        z.literal(30),
        z.literal("every-hour"), // every hour at start
        z.literal("custom"), // custom
      ],
      { message: "Unknow option" }
    )
    .optional(),
  customSlotTimes: z.array(customTimeSlotSchema).optional(),
  timeZone: zTimeZone,
  scheduleAppId: z.string().optional(),
  autoConfirm: z.coerce.boolean().optional(),
  allowSmartSchedule: z.coerce.boolean().optional(),
  smartSchedule: z
    .object({
      allowSkipBreak: z.coerce.boolean().optional(),
      preferBackToBack: z.coerce.boolean().optional(),
      allowSmartSlotStarts: z.coerce.boolean().optional(),
      maximizeForOption: asOptionalField(z.string()),
    })
    .optional(),
});

export const appointOptionsSchema = z.array(
  z.object({
    id: z.string().min(1, "Option is required"),
  })
);

export const bookingConfigurationSchema = generalBookingConfigurationSchema
  .merge(
    z.object({
      calendarSources: calendarSourcesConfigurationSchema,
      options: appointOptionsSchema,
    })
  )
  .superRefine((arg, ctx) => {
    if (arg.slotStart === "custom" && !arg.customSlotTimes?.length) {
      ctx.addIssue({
        path: ["specifiedSlotTimes"],
        code: z.ZodIssueCode.custom,
        message: "Custom time slots are required",
      });
    }
  });

export type BookingConfiguration = z.infer<typeof bookingConfigurationSchema>;
