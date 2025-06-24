import type { AdminKeys } from "@vivid/i18n";
import type { ReactElement } from "react";

export interface NavItem {
  id: string;
  title: AdminKeys;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: ReactElement;
  label?: AdminKeys;
  description?: AdminKeys;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItem[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItem[];
}

export interface NavItemGroup {
  title: AdminKeys;
  children: NavItemWithOptionalChildren[];
}

export interface FooterItem {
  title: AdminKeys;
  items: {
    title: AdminKeys;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;
