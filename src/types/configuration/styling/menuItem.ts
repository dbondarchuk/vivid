import { ButtonSizes, ButtonVariants } from "@/components/ui/button";
import { LinkSizes, LinkVariants } from "@/components/ui/link";
import { TextFonts, TextSizes, TextWeights } from "@/components/ui/text";
import { icons } from "lucide-react";
import { z } from "zod";

const [firstIcon, ...restIcons] = Object.keys(icons);
const iconsEnum = z.enum([firstIcon, ...restIcons], {
  required_error: "Icon is required",
});

export const itemTypes = ["icon", "link", "button"] as const;

const types = z.enum(itemTypes);

const [firstLinkVariant, ...restLinkVariants] = LinkVariants;
const [firstLinkSize, ...restLinkSizes] = LinkSizes;
const [firstButtonVariant, ...restButtonVariants] = ButtonVariants;
const [firstButtonSize, ...restButtonSizes] = ButtonSizes;
const [firstFont, ...restFonts] = TextFonts;
const [firstTextSize, ...restTextSizes] = TextSizes;
const [firstTextWeight, ...restTextWeights] = TextWeights;

export const baseMenuItemSchema = z.object({
  url: z.string({ required_error: "URL must be provided" }),
  label: z.string({ required_error: "Label is required" }),
  className: z.string().optional(),
});

export type BaseMenuItem = z.infer<typeof baseMenuItemSchema>;

export const iconMenuItemSchema = baseMenuItemSchema.merge(
  z.object({
    icon: iconsEnum,
    type: types.extract(["icon"]),
  })
);

export type IconMenuItem = z.infer<typeof iconMenuItemSchema>;

const textStyleSchema = baseMenuItemSchema.merge(
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

export type TextStyle = z.infer<typeof textStyleSchema>;

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

export type LinkMenuItem = z.infer<typeof linkMenuItemSchema>;

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

export type ButtonMenuItem = z.infer<typeof buttonMenuItemSchema>;

export const menuItemSchema = z.discriminatedUnion("type", [
  iconMenuItemSchema,
  linkMenuItemSchema,
  buttonMenuItemSchema,
]);

export type MenuItem = z.infer<typeof menuItemSchema>;

export const menuItemsSchema = z.array(menuItemSchema);

export type MenuItems = z.infer<typeof menuItemsSchema>;
