import { z } from "zod";

export const paymentsConfigurationSchema = z
  .object({
    paymentAppId: z.string().min(1, "Payment app is required"),
    enable: z.literal(true),
  })
  .and(
    z.discriminatedUnion("requireDeposit", [
      z.object({
        requireDeposit: z.literal(false).optional(),
      }),
      z.object({
        requireDeposit: z.literal(true),
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
      enable: z.literal(false).optional(),
    })
  );

export type PaymentsConfiguration = z.infer<typeof paymentsConfigurationSchema>;
