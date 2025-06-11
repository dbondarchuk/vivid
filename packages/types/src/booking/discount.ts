import { z } from "zod";
import { WithDatabaseId } from "../database";
import { asOptinalNumberField, zUniqueArray } from "../utils";

export const fixedAmountDiscountType = "amount";
export const percentageDiscountType = "percentage";

export const discountTypes = [
  fixedAmountDiscountType,
  percentageDiscountType,
] as const;

export const discountSchema = z
  .object({
    name: z.string().min(2, "Discount name should be at least 2 characters"),
    enabled: z.coerce.boolean(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    appointmentStartDate: z.coerce.date().optional(),
    appointmentEndDate: z.coerce.date().optional(),
    maxUsage: asOptinalNumberField(
      z.coerce
        .number({ message: "Must be a number greater than 1" })
        .int("Must be a number greater than 1")
        .min(1, "Must be a number greater than 1")
    ),
    maxUsagePerCustomer: asOptinalNumberField(
      z.coerce
        .number({ message: "Must be a number greater than 1" })
        .int("Must be a number greater than 1")
        .min(1, "Must be a number greater than 1")
    ),
    type: z.enum(discountTypes),
    limitTo: z
      .array(
        z.object({
          addons: z
            .array(
              z.object({
                ids: zUniqueArray(
                  z
                    .array(
                      z.object({
                        id: z.string().min(1, "Addon id is required"),
                      })
                    )
                    .min(1, "At least one addon is required"),
                  (addon) => addon.id,
                  "Must be unique values"
                ),
              })
            )
            .optional(),
          options: zUniqueArray(
            z.array(
              z.object({
                id: z.string().min(1, "Option id is required"),
              })
            ),
            (option) => option.id
          ).optional(),
        })
      )
      .optional(),
    value: z.coerce
      .number({ message: "Promo code value should be positive number" })
      .int("Promo code value should be positive number"),
    codes: zUniqueArray(
      z
        .array(
          z.string().min(3, "Promo code should be at least 3 characters long")
        )
        .min(1, "At least one promo code should be added")
        .max(10, "Maximum 10 promo codes per discount is allowed"),
      (code) => code,
      "Codes must be unique"
    ),
  })
  .superRefine((arg, ctx) => {
    if (arg.startDate && arg.endDate && arg.endDate < arg.startDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date should be greater than start date",
      });
    }
    if (arg.type === "percentage" && arg.value > 100) {
      ctx.addIssue({
        code: "custom",
        path: ["value"],
        message: "Value can not be greater than 100",
      });
    }
  });

export type DiscountUpdateModel = z.infer<typeof discountSchema>;
export type Discount = WithDatabaseId<DiscountUpdateModel> & {
  updatedAt: Date;
};

export type DiscountType = Discount["type"];

export const getDiscountSchemaWithUniqueCheck = (
  uniqueNameAndCodeCheckFn: (
    name: string,
    codes: string[]
  ) => Promise<{
    name: boolean;
    code: Record<string, boolean>;
  }>,
  nameMessage: string,
  codeMessage: string
) => {
  return discountSchema.superRefine(async (arg, ctx) => {
    const isUnique = await uniqueNameAndCodeCheckFn(arg.name, arg.codes);

    if (!isUnique.name) {
      ctx.addIssue({
        code: "custom",
        path: ["name"],
        message: nameMessage,
      });
    }

    for (const [code, valid] of Object.entries(isUnique.code)) {
      const index = arg.codes.indexOf(code);
      if (valid || index < 0) continue;

      ctx.addIssue({
        code: "custom",
        path: [`codes.${index}`],
        message: codeMessage,
      });
    }
  });
};

export const applyDiscountRequestSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  optionId: z.string().min(1, "Option ID is required"),
  dateTime: z.coerce.date({ message: "Must be a valid date" }),
  addons: zUniqueArray(
    z.array(z.string().min(1, "Addon ID is required")),
    (id) => id,
    "Addons IDs should be unique"
  ).optional(),
  code: z.string().min(1, "Promo code is required"),
});

export type ApplyDiscountRequest = z.infer<typeof applyDiscountRequestSchema>;
export type ApplyCustomerDiscountRequest = Omit<
  ApplyDiscountRequest,
  "name" | "email" | "phone"
> & {
  customerId?: string;
};

export type ApplyDiscountResponse = {
  code: string;
  value: number;
  type: DiscountType;
};
