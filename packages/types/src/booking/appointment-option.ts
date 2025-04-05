import { z } from "zod";
import { WithDatabaseId } from "../database";
import { asOptionalField, zUniqueArray } from "../utils";

export const appointmentOptionSchema = z.object({
  name: z.string().min(2, "Option name must me at least 2 characters long"),
  // description: z.array(z.any()),
  description: z.string().min(2, "Option description is required"),
  duration: asOptionalField(
    z.coerce
      .number()
      .int("Should be the integer value")
      .min(0, "Option duration must be at least 0 minutes")
  ),

  price: asOptionalField(
    z.coerce.number().min(0, "Option price must be at least 0")
  ),
  addons: zUniqueArray(
    z.array(
      z.object({
        id: z.string().min(1, "Addon id is required"),
      })
    ),
    (addon) => addon.id
  ).optional(),
  fields: zUniqueArray(
    z.array(
      z.object({
        id: z.string().min(1, "Field id is required"),
        required: z.coerce.boolean().optional(),
      })
    ),
    (field) => field.id
  ).optional(),
});

export type AppointmentOptionUpdateModel = z.infer<
  typeof appointmentOptionSchema
>;

export type AppointmentOption = WithDatabaseId<AppointmentOptionUpdateModel> & {
  updatedAt: Date;
};

export const getAppointmentOptionSchemaWithUniqueCheck = (
  uniqueNameCheckFn: (name: string) => Promise<boolean>,
  message: string
) => {
  return appointmentOptionSchema.superRefine(async (args, ctx) => {
    const isUnique = await uniqueNameCheckFn(args.name);
    if (!isUnique) {
      ctx.addIssue({
        code: "custom",
        path: ["name"],
        message,
      });
    }
  });
};

export const appointmentAddonSchema = z.object({
  name: z.string().min(2, "Addon name must me at least 2 characters long"),
  // description: z.array(z.any()),
  description: z.string().min(2, "Addon description is required"),
  duration: asOptionalField(
    z.coerce
      .number()
      .int("Should be the integer value")
      .min(0, "Addon duration must be at least 0 minutes")
  ),
  price: asOptionalField(
    z.coerce.number().min(0, "Addon price must be at least 0")
  ),
  fields: zUniqueArray(
    z.array(
      z.object({
        id: z.string().min(1, "Field id is required"),
        required: z.coerce.boolean().optional(),
      })
    ),
    (field) => field.id
  ).optional(),
});

export const getAppointmentAddonSchemaWithUniqueCheck = (
  uniqueNameCheckFn: (name: string) => Promise<boolean>,
  message: string
) => {
  return appointmentAddonSchema.superRefine(async (args, ctx) => {
    const isUnique = await uniqueNameCheckFn(args.name);
    if (!isUnique) {
      ctx.addIssue({
        code: "custom",
        path: ["name"],
        message,
      });
    }
  });
};

export type AppointmentAddonUpdateModel = z.infer<
  typeof appointmentAddonSchema
>;

export type AppointmentAddon = WithDatabaseId<AppointmentAddonUpdateModel> & {
  updatedAt: Date;
};

export const appointmentAddonsSchema = z
  .array(appointmentAddonSchema)
  .optional();
export type AppointmentAddons = z.infer<typeof appointmentAddonsSchema>;

export type AppointmentChoice = Omit<AppointmentOption, "addons"> & {
  addons: AppointmentAddon[];
};
