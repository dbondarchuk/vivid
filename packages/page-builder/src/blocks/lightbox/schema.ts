import { BaseReaderBlockProps } from "@vivid/builder";
import { Prettify } from "@vivid/types";
import z from "zod";

export const overlayType = ["blur", "default"] as const;

export const LightboxPropsSchema = z.object({
  props: z.object({
    overlay: z.enum(overlayType),
    showAltAsDescription: z.boolean().optional().nullable(),
    navigation: z.coerce.boolean().optional().nullable(),
    loop: z.coerce.boolean().optional().nullable(),
    autoPlay: z.number().positive().min(1).max(30).optional().nullable(),
    children: z.array(z.any()),
  }),
});

export type LightboxProps = Prettify<z.infer<typeof LightboxPropsSchema>>;
export type LightboxReaderProps = BaseReaderBlockProps<any> & LightboxProps;

export const LightboxPropsDefaults = {
  props: {
    overlay: "default",
    showAltAsDescription: true,
    navigation: true,
    loop: true,
    autoPlay: null,
    children: [],
  },
} as const satisfies LightboxProps;
