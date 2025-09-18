import { z } from "zod";
import { zOptionalOrMinLengthString, zPhone, zUniqueArray } from "../utils";
import { Prettify } from "../utils/helpers";
import { zTimeZone } from "../utils/zTimeZone";
import { AppointmentAddon, AppointmentOption } from "./appointment-option";

export type AppointmentFields = {
  name: string;
  email: string;
  phone: string;
} & {
  [key: string]: any;
};

export type AppointmentDiscount = {
  id: string;
  name: string;
  code: string;
  discountAmount: number;
};

export type AppointmentEventOption = Prettify<
  Pick<AppointmentOption, "_id" | "name" | "price" | "duration">
>;
export type AppointmentEventAddon = Prettify<
  Pick<AppointmentAddon, "_id" | "name" | "price" | "duration">
>;

export type AppointmentEvent = {
  totalDuration: number;
  totalPrice?: number;
  dateTime: Date;
  timeZone: string;
  fields: AppointmentFields;
  option: AppointmentEventOption;
  fieldsLabels?: Record<string, string>;
  addons?: AppointmentEventAddon[];
  note?: string;
  discount?: AppointmentDiscount;
};

export const appointmentRequestSchema = z.object({
  optionId: z.string().min(1, "appointments.request.optionId.required"),
  addonsIds: zUniqueArray(
    z.array(z.string().min(1, "appointments.request.addonsIds.required")),
    (x) => x,
    "appointments.request.addonsIds.unique",
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
    .passthrough(),
  promoCode: zOptionalOrMinLengthString(
    1,
    "appointments.request.promoCode.min",
  ),
  paymentIntentId: zOptionalOrMinLengthString(
    1,
    "appointments.request.paymentIntentId.min",
  ),
});

export type AppointmentRequest = z.infer<typeof appointmentRequestSchema>;

export class AppointmentTimeNotAvaialbleError extends Error {}
