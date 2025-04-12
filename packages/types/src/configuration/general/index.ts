import { z } from "zod";

export const generalConfigurationSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Website Name must be at least 3 characters" }),
  title: z
    .string()
    .min(3, { message: "Website Title must be at least 3 characters" }),
  description: z
    .string()
    .min(3, { message: "Website Description must be at least 3 characters" }),
  keywords: z
    .string()
    .min(3, { message: "Website Keywords must be at least 3 characters" }),
  phone: z
    .string()
    .refine((s) => !s?.includes("_"), "Invalid phone number")
    .optional(),
  email: z.string().email("Email is required"),
  address: z.string().optional(),
  url: z
    .string()
    .url("Website url should be valid URL address")
    .min(3, { message: "Website Name must be at least 3 characters" }),
  logo: z.string().optional(),
  favicon: z.string().optional(),
});

export type GeneralConfiguration = z.infer<typeof generalConfigurationSchema>;
