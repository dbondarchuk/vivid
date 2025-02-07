import {
  ButtonSizes,
  ButtonVariants,
  LinkSizes,
  LinkVariants,
  TextFonts,
  TextSizes,
  TextWeights,
} from "@vivid/ui";

import { z } from "zod";

import { icons } from "lucide-react";

const [firstIcon, ...restIcons] = Object.keys(icons);
const iconsEnum = z.enum([firstIcon, ...restIcons], {
  required_error: "Icon is required",
});

export const menuItemTypes = z.enum(["icon", "link", "button", "submenu"]);
export type MenuItemType = z.infer<typeof menuItemTypes>;

const [firstLinkVariant, ...restLinkVariants] = LinkVariants;
const [firstLinkSize, ...restLinkSizes] = LinkSizes;
const [firstButtonVariant, ...restButtonVariants] = ButtonVariants;
const [firstButtonSize, ...restButtonSizes] = ButtonSizes;
const [firstFont, ...restFonts] = TextFonts;
const [firstTextSize, ...restTextSizes] = TextSizes;
const [firstTextWeight, ...restTextWeights] = TextWeights;

export const baseMenuItemSchema = z.object({
  url: z.string().min(1, "URL must be provided"),
  label: z.string().min(1, "Label is required"),
  className: z.string().optional(),
});

export type BaseMenuItem = z.infer<typeof baseMenuItemSchema>;

export const iconMenuItemSchema = baseMenuItemSchema.merge(
  z.object({
    icon: iconsEnum,
    type: menuItemTypes.extract(["icon"]),
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
    type: menuItemTypes.extract(["link"]),
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
    type: menuItemTypes.extract(["button"]),
  })
);

export type ButtonMenuItem = z.infer<typeof buttonMenuItemSchema>;

export const subMenuItemSchema = linkMenuItemSchema;

export type SubMenuItem = z.infer<typeof subMenuItemSchema>;

export const subMenuMenuItemSchema = linkMenuItemSchema
  .omit({ url: true })
  .merge(
    z.object({
      children: subMenuItemSchema
        .array()
        .min(1, "Sub menu should have at least one item"),
      type: menuItemTypes.extract(["submenu"]),
    })
  );

export type SubMenuMenuItem = z.infer<typeof subMenuMenuItemSchema>;

export const menuItemSchema = z.discriminatedUnion("type", [
  iconMenuItemSchema,
  linkMenuItemSchema,
  buttonMenuItemSchema,
]);

export type MenuItem = z.infer<typeof menuItemSchema>;

export const menuItemWithSubMenuSchema = z.discriminatedUnion("type", [
  ...menuItemSchema.options,
  subMenuMenuItemSchema,
]);

export type MenuItemWithSubMenu = z.infer<typeof menuItemWithSubMenuSchema>;

export const menuItemsSchema = z.array(menuItemSchema);
export type MenuItems = z.infer<typeof menuItemsSchema>;

export const menuItemsWithSubMenuSchema = z.array(menuItemWithSubMenuSchema);
export type MenuItemsWithSubMenus = z.infer<typeof menuItemsWithSubMenuSchema>;
