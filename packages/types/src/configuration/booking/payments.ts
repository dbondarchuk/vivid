import { z } from "zod";

export const paymentsConfigurationSchema = z
  .object({
    paymentAppId: z.string().min(1, "Payment app is required"),
    enable: z.literal(true, { message: "Payment app is required" }),
  })
  .and(
    z.discriminatedUnion("requireDeposit", [
      z.object({
        requireDeposit: z
          .literal(false, { message: "Deposit amount is required if enabled" })
          .optional(),
      }),
      z.object({
        requireDeposit: z.literal(true, {
          message: "Deposit amount is required",
        }),
        depositPercentage: z.coerce
          .number({ message: "Must be a number between 10 and 100" })
          .int("Must be a number between 10 and 100")
          .min(10, "Must be a number between 10 and 100")
          .max(100, "Must be a number between 10 and 100"),
      }),
    ])
  )
  .or(
    z.object({
      enable: z
        .literal(false, { message: "Payment app is required if enabled" })
        .optional(),
    })
  );

export type PaymentsConfiguration = z.infer<typeof paymentsConfigurationSchema>;
