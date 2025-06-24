import { z } from "zod";

export const installSchema = z.object({
  name: z.string().min(3, { message: "install.nameMin" }),
  title: z.string().min(3, { message: "install.titleMin" }),
  email: z.string().email("common.email.invalid"),
  url: z
    .string()
    .url("common.url.invalid")
    .min(3, { message: "common.url.invalid" }),
});

export type InstallFormData = z.infer<typeof installSchema>;
