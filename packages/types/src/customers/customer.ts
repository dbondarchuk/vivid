import { z } from "zod";
import { Appointment } from "../booking";
import { WithDatabaseId } from "../database";
import { zUniqueArray } from "../utils";

export const isPaymentRequiredForCustomerTypes = [
  "inherit",
  "always",
  "never",
] as const;

const isPaymentRequiredForCustomerSchema = z.enum(
  isPaymentRequiredForCustomerTypes
);

export const customerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().min(1, "Phone is required"),
    dateOfBirth: z.coerce.date().optional(),
    avatar: z.string().optional(),
    note: z.string().optional(),
    knownNames: zUniqueArray(
      z.array(z.string().min(1, "Name is required")),
      (s) => s,
      "Names should be unique"
    ),
    knownEmails: zUniqueArray(
      z.array(z.string().email("Valid email is required")),
      (s) => s,
      "Emails should be unique"
    ),
    knownPhones: zUniqueArray(
      z.array(z.string().min(1, "Phone is required")),
      (s) => s,
      "Phones should be unique"
    ),
    dontAllowBookings: z.coerce.boolean().optional(),
  })
  .and(
    z
      .object({
        requireDeposit: isPaymentRequiredForCustomerSchema.exclude(["always"], {
          message: "Deposit amount is required if always",
        }),
      })
      .or(
        z.object({
          requireDeposit: isPaymentRequiredForCustomerSchema.extract(
            ["always"],
            {
              message: "Deposit amount is required",
            }
          ),
          depositPercentage: z.coerce
            .number({ message: "Must be a number between 10 and 100" })
            .int("Must be a number between 10 and 100")
            .min(10, "Must be a number between 10 and 100")
            .max(100, "Must be a number between 10 and 100"),
        })
      )
  );

export const getCustomerSchemaWithUniqueCheck = (
  uniqueEmailOrPhoneCheckFn: (
    emails: string[],
    phone: string[]
  ) => Promise<{ email: boolean; phone: boolean }>,
  emailMessage: string,
  phoneMessage: string
) => {
  return customerSchema.superRefine(async (args, ctx) => {
    const isUnique = await uniqueEmailOrPhoneCheckFn(
      [args.email, ...(args.knownEmails || [])],
      [args.phone, ...(args.knownPhones || [])]
    );
    if (!isUnique.email) {
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: emailMessage,
      });
    }

    if (!isUnique.phone) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: phoneMessage,
      });
    }
  });
};

export type CustomerUpdateModel = z.infer<typeof customerSchema>;
export type Customer = WithDatabaseId<CustomerUpdateModel>;

export type CustomerListModel = Pick<
  Customer,
  "_id" | "avatar" | "name" | "phone" | "email"
> & {
  appointmentsCount: number;
  lastAppointment?: Appointment;
  nextAppointment?: Appointment;
};

export type CustomerSearchField = "name" | "email" | "phone";
