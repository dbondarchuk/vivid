import { z } from "zod";
import { asOptionalField, zPhone } from "../../utils";

export const generalConfigurationSchema = z.object({
  name: z.string().min(3, { message: "configuration.general.name.min" }),
  title: z.string().min(3, { message: "configuration.general.title.min" }),
  description: z
    .string()
    .min(3, { message: "configuration.general.description.min" }),
  keywords: z
    .string()
    .min(3, { message: "configuration.general.keywords.min" }),
  phone: asOptionalField(zPhone),
  email: z.string().email("common.email.required"),
  address: z.string().optional(),
  url: z
    .string()
    .url("configuration.general.url.invalid")
    .min(3, { message: "configuration.general.url.min" }),
  logo: z.string().optional(),
  favicon: z.string().optional(),
});

export type GeneralConfiguration = z.infer<typeof generalConfigurationSchema>;
