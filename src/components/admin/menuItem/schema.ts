import { ButtonSizes, ButtonVariants } from "@/components/ui/button";
import { LinkSizes, LinkVariants } from "@/components/ui/link";
import { TextFonts, TextSizes, TextWeights } from "@/components/ui/text";
import { icons } from "lucide-react";
import { z } from "zod";
import { itemTypes } from "./menuItemCard";

const [firstIcon, ...restIcons] = Object.keys(icons);
const iconsEnum = z.enum([firstIcon, ...restIcons], {
  required_error: "Icon is required",
});

const types = z.enum(itemTypes);

const [firstLinkVariant, ...restLinkVariants] = LinkVariants;
const [firstLinkSize, ...restLinkSizes] = LinkSizes;
const [firstButtonVariant, ...restButtonVariants] = ButtonVariants;
const [firstButtonSize, ...restButtonSizes] = ButtonSizes;
const [firstFont, ...restFonts] = TextFonts;
const [firstTextSize, ...restTextSizes] = TextSizes;
const [firstTextWeight, ...restTextWeights] = TextWeights;

export const baseSchema = z.object({
  url: z.string({ required_error: "URL must be provided" }),
  label: z.string({ required_error: "Label is required" }),
  className: z.string().optional(),
});

export const iconMenuItemSchema = baseSchema.merge(
  z.object({
    icon: iconsEnum,
    type: types.extract(["icon"]),
  })
);

const textStyleSchema = baseSchema.merge(
  z.object({
    font: z
      .enum([firstFont, ...restFonts])
      .nullable()
      .optional(),
    fontSize: z
      .enum([firstTextSize, ...restTextSizes])
      .nullable()
      .optional(),
    fontWeight: z
      .enum([firstTextWeight, ...restTextWeights])
      .nullable()
      .optional(),
  })
);

export const linkMenuItemSchema = textStyleSchema.merge(
  z.object({
    prefixIcon: iconsEnum.optional(),
    suffixIcon: iconsEnum.optional(),
    variant: z
      .enum([firstLinkVariant, ...restLinkVariants])
      .nullable()
      .optional(),
    size: z
      .enum([firstLinkSize, ...restLinkSizes])
      .nullable()
      .optional(),
    type: types.extract(["link"]),
  })
);

export const buttonMenuItemSchema = linkMenuItemSchema.merge(
  z.object({
    variant: z
      .enum([firstButtonVariant, ...restButtonVariants])
      .nullable()
      .optional(),
    size: z
      .enum([firstButtonSize, ...restButtonSizes])
      .nullable()
      .optional(),
    type: types.extract(["button"]),
  })
);

export const menuItemsSchema = z.array(
  z.discriminatedUnion("type", [
    iconMenuItemSchema,
    linkMenuItemSchema,
    buttonMenuItemSchema,
  ])
);

export type LinkMenuItemSchema = z.infer<typeof linkMenuItemSchema>;
