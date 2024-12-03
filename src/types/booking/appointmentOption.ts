import { z } from "zod";
import { Fields, WithLabelFieldData } from "./fields";

export const appointmentOptionSchema = z.object({
  name: z.string().min(2, "Option name must me at least 2 characters long"),
  id: z.string(),
  description: z
    .string()
    .min(2, "Option description must be at least 2 characters long"),
  duration: z.coerce
    .number()
    .min(0, "Option duration must be at least 0 minutes")
    .optional(),

  price: z.coerce.number().min(0, "Option price must be at least 0").optional(),
  addons: z
    .array(
      z.object({
        id: z.string().min(1, "Addon id is required"),
      })
    )
    .optional(),
  fields: z
    .array(
      z.object({
        id: z.string().min(1, "Field id is required"),
      })
    )
    .optional(),
});

export type AppointmentOption = z.infer<typeof appointmentOptionSchema>;

export const appointmentAddonSchema = z.object({
  name: z.string().min(2, "Addon name must me at least 2 characters long"),
  id: z.string(),
  description: z
    .string()
    .min(2, "Addon description must be at least 2 characters long"),
  duration: z.coerce
    .number()
    .min(0, "Addon duration must be at least 0 minutes")
    .optional(),
  price: z.coerce.number().min(0, "Addon price must be at least 0").optional(),
});

export type AppointmentAddon = z.infer<typeof appointmentAddonSchema>;

export const appointmentAddonsSchema = z
  .array(appointmentAddonSchema)
  .optional();
export type AppointmentAddons = z.infer<typeof appointmentAddonsSchema>;

export type AppointmentChoice = Omit<AppointmentOption, "fields" | "addons"> & {
  fields: Fields<WithLabelFieldData>;
  addons: AppointmentAddon[];
};
