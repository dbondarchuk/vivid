import { z } from "zod";

export const installSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Website Name must be at least 3 characters" }),
  title: z
    .string()
    .min(3, { message: "Website Title must be at least 3 characters" }),
  email: z.string().email("Email is required"),
  url: z
    .string()
    .url("Website url should be valid URL address")
    .min(3, { message: "Website Name must be at least 3 characters" }),
});

export type InstallFormData = z.infer<typeof installSchema>;
