import { z } from "zod";
import { zUniqueArray } from "../utils";
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
};

export const appointmentRequestSchema = z.object({
  optionId: z.string().min(1, "OptionID is required"),
  addonsIds: zUniqueArray(
    z.array(z.string().min(1, "AddonID is required")),
    (x) => x,
    "Addon IDs should be unique"
  ).optional(),
  dateTime: z.coerce.date({ message: "DateTime is required" }),
  timeZone: zTimeZone,
  duration: z.coerce
    .number()
    .int("Only positive integer numbers allowed")
    .positive("Only positive integer numbers allowed")
    .optional(),
  fields: z
    .object({
      email: z.string().email("Valid email is required").trim(),
      name: z.string().min(1, "Name is required").trim(),
      phone: z.string().min(1, "Name is required").trim(),
    })
    .and(
      z.record(
        z.string(),
        z.union([z.number(), z.date(), z.boolean(), z.string()])
      )
    ),
});

export type AppointmentRequest = z.infer<typeof appointmentRequestSchema>;

export class AppointmentTimeNotAvaialbleError extends Error {}
