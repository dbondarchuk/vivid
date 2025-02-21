import { z } from "zod";

import { zUniqueArray } from "../../utils";
import { resourceSchema } from "../resources";

import allFonts from "./fonts.json";

export const fontsNames = allFonts.items.map((font) => font.family);

const [firstFont, ...restFonts] = fontsNames;

export const fontName = z.enum([firstFont, ...restFonts], {
  message: "Unknown font",
});

export const colors = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
] as const;

export const colorsEnum = z.enum(colors, { message: "Unknown color setting" });

export const colorOverrideSchema = z.object({
  type: colorsEnum,
  value: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
      message: "Color must be a valid HEX value, starting with #",
    }),
});

export type ColorOverrideSchema = z.infer<typeof colorOverrideSchema>;

export const stylingConfigurationSchema = z.object({
  colors: zUniqueArray(
    colorOverrideSchema.array(),
    (item) => item.type,
    "Colors should be unique"
  ).optional(),
  fonts: z
    .object({
      primary: fontName.optional(),
      secondary: fontName.optional(),
      tertiary: fontName.optional(),
    })
    .optional(),
  css: z.array(resourceSchema).optional(),
});

export type StylingConfiguration = z.infer<typeof stylingConfigurationSchema>;
