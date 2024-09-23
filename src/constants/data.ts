import { NavItemWithOptionalChildren } from "@/types";

export const navItems: NavItemWithOptionalChildren[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "Appointments",
    href: "/admin/dashboard/appointments",
    icon: "appointments",
    label: "Appointments",
  },
  {
    title: "Assets",
    href: "/admin/dashboard/assets",
    icon: "assets",
    label: "Assets",
  },
  {
    title: "Settings",
    icon: "settings",
    items: [
      {
        title: "General",
        href: "/admin/dashboard/settings/general",
        icon: "cog",
        label: "General",
      },
      {
        title: "Social",
        href: "/admin/dashboard/settings/social",
        icon: "social",
        label: "Social",
      },
      {
        title: "SMTP",
        href: "/admin/dashboard/settings/smtp",
        icon: "smtp",
        label: "SMTP",
      },
      {
        title: "Header",
        href: "/admin/dashboard/settings/header",
        icon: "header",
        label: "Header",
      },
      {
        title: "Footer",
        href: "/admin/dashboard/settings/footer",
        icon: "footer",
        label: "Footer",
      },
      {
        title: "Appointments",
        href: "/admin/dashboard/settings/appointments",
        icon: "appointments",
        label: "Appointments",
      },
    ],
  },
];
