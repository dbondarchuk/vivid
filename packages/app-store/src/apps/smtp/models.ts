import { asOptionalField } from "@vivid/types";
import { z } from "zod";

export const smtpConfigurationSchema = z.object({
  host: z.string().min(3, { message: "smtp.host.required" }),
  port: z.coerce
    .number()
    .int("smtp.port.integer")
    .min(1, { message: "smtp.port.min" })
    .max(99999, { message: "smtp.port.max" }),
  secure: z.coerce.boolean(),
  email: z.string().email("smtp.email.invalid"),
  auth: z.object({
    user: asOptionalField(z.string()),
    pass: asOptionalField(z.string()),
  }),
});

export type SmtpConfiguration = z.infer<typeof smtpConfigurationSchema>;
