import { z } from "zod";

export const smtpConfigurationSchema = z.object({
  host: z.string().min(3, { message: "SMTP host is required" }),
  port: z.coerce
    .number()
    .min(1, { message: "SMTP port number must be between 1 and 99999" })
    .max(99999, { message: "SMTP port number must be between 1 and 99999" }),
  secure: z.coerce.boolean(),
  email: z.string().email("Email must be a correct email address"),
  auth: z.object({
    user: z.string().optional(),
    pass: z.string().optional(),
  }),
});

export type SmtpConfiguration = z.infer<typeof smtpConfigurationSchema>;
