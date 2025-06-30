import { z } from "zod";
import { WithDatabaseId } from "../database";
import { asOptinalNumberField, zUniqueArray } from "../utils";
import { Prettify } from "../utils/helpers";

export const isPaymentRequiredForOptionTypes = [
  "inherit",
  "always",
  "never",
] as const;

const isPaymentRequiredForOptionSchema = z.enum(
  isPaymentRequiredForOptionTypes
);

export const appointmentOptionSchema = z
  .object({
    name: z.string().min(2, "appointments.option.name.required"),
    // description: z.array(z.any()),
    description: z.string().min(2, "appointments.option.description.required"),
    duration: asOptinalNumberField(
      z.coerce
        .number()
        .int("appointments.option.duration.positive")
        .min(1, "appointments.option.duration.positive")
    ),

    price: asOptinalNumberField(
      z.coerce.number().min(1, "appointments.option.price.min")
    ),
    addons: zUniqueArray(
      z.array(
        z.object({
          id: z.string().min(1, "appointments.option.addons.id.required"),
        })
      ),
      (addon) => addon.id,
      "appointments.option.addons.id.unique"
    ).optional(),
    fields: zUniqueArray(
      z.array(
        z.object({
          id: z.string().min(1, "appointments.option.fields.id.required"),
          required: z.coerce.boolean().optional(),
        })
      ),
      (field) => field.id,
      "appointments.option.fields.id.unique"
    ).optional(),
  })
  .and(
    z
      .object({
        requireDeposit: isPaymentRequiredForOptionSchema.exclude(["always"], {
          message: "appointments.option.requireDeposit.required",
        }),
      })
      .or(
        z.object({
          requireDeposit: isPaymentRequiredForOptionSchema.extract(["always"], {
            message: "appointments.option.requireDeposit.required",
          }),
          depositPercentage: z.coerce
            .number({
              message: "appointments.option.depositPercentage.required",
            })
            .int("appointments.option.depositPercentage.required")
            .min(10, "appointments.option.depositPercentage.required")
            .max(100, "appointments.option.depositPercentage.required"),
        })
      )
  );

export type AppointmentOptionUpdateModel = z.infer<
  typeof appointmentOptionSchema
>;

export type AppointmentOption = Prettify<
  WithDatabaseId<AppointmentOptionUpdateModel>
> & {
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
  name: z.string().min(2, "addons.name.required"),
  // description: z.array(z.any()),
  description: z.string().min(2, "addons.description.required"),
  duration: asOptinalNumberField(
    z.coerce
      .number()
      .int("addons.duration.positive")
      .min(1, "addons.duration.positive")
  ),
  price: asOptinalNumberField(z.coerce.number().min(1, "addons.price.min")),
  fields: zUniqueArray(
    z.array(
      z.object({
        id: z.string().min(1, "appointments.option.fields.id.required"),
        required: z.coerce.boolean().optional(),
      })
    ),
    (field) => field.id,
    "appointments.option.fields.id.unique"
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

export type AppointmentAddon = Prettify<
  WithDatabaseId<AppointmentAddonUpdateModel>
> & {
  updatedAt: Date;
};

export const appointmentAddonsSchema = z
  .array(appointmentAddonSchema)
  .optional();
export type AppointmentAddons = z.infer<typeof appointmentAddonsSchema>;

export type AppointmentChoice = Prettify<
  Omit<AppointmentOption, "addons"> & {
    addons: AppointmentAddon[];
  }
>;
