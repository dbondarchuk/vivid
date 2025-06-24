import { z } from "zod";
import { zOptionalOrMinLengthString, zPhone, zUniqueArray } from "../utils";
import { zTimeZone } from "../utils/zTimeZone";
import { AppointmentAddon, AppointmentOption } from "./appointment-option";

export type AppointmentFields = Record<
  string,
  string | boolean | Date | number
> & {
  name: string;
  email: string;
  phone: string;
};

export type AppointmentDiscount = {
  id: string;
  name: string;
  code: string;
  discountAmount: number;
};

export type AppointmentEvent = {
  totalDuration: number;
  totalPrice?: number;
  dateTime: Date;
  timeZone: string;
  fields: AppointmentFields;
  option: Omit<AppointmentOption, "fields" | "addons" | "updatedAt">;
  fieldsLabels?: Record<string, string>;
  addons?: Omit<AppointmentAddon, "updatedAt">[];
  note?: string;
  discount?: AppointmentDiscount;
};

export const appointmentRequestSchema = z.object({
  optionId: z.string().min(1, "appointments.request.optionId.required"),
  addonsIds: zUniqueArray(
    z.array(z.string().min(1, "appointments.request.addonsIds.required")),
    (x) => x,
    "appointments.request.addonsIds.unique"
  ).optional(),
  dateTime: z.coerce.date({
    message: "appointments.request.dateTime.required",
  }),
  timeZone: zTimeZone,
  duration: z.coerce
    .number({ message: "appointments.request.duration.required" })
    .int("appointments.request.duration.positive")
    .min(1, "appointments.request.duration.positive"),
  fields: z
    .object({
      email: z
        .string()
        .email("appointments.request.fields.email.required")
        .trim(),
      name: z
        .string()
        .min(1, "appointments.request.fields.name.required")
        .trim(),
      phone: zPhone,
    })
    .and(
      z.record(
        z.string(),
        z.union([z.number(), z.date(), z.boolean(), z.string()])
      )
    ),
  promoCode: zOptionalOrMinLengthString(
    1,
    "appointments.request.promoCode.min"
  ),
  paymentIntentId: zOptionalOrMinLengthString(
    1,
    "appointments.request.paymentIntentId.min"
  ),
});

export type AppointmentRequest = z.infer<typeof appointmentRequestSchema>;

export class AppointmentTimeNotAvaialbleError extends Error {}
