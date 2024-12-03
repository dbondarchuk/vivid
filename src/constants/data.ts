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
    title: "Pages",
    href: "/admin/dashboard/pages",
    icon: "pages",
    label: "Pages",
  },
  {
    title: "Appearance",
    icon: "paintbrush",
    items: [
      {
        title: "Styling",
        href: "/admin/dashboard/appearence/styling",
        icon: "brush",
        label: "styling",
      },
      {
        title: "Header",
        href: "/admin/dashboard/appearence/header",
        icon: "header",
        label: "Header",
      },
      {
        title: "Footer",
        href: "/admin/dashboard/appearence/footer",
        icon: "footer",
        label: "Footer",
      },
    ],
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
        title: "SMS",
        href: "/admin/dashboard/settings/sms",
        icon: "sms",
        label: "SMS",
      },
      {
        title: "Scripts",
        href: "/admin/dashboard/settings/scripts",
        icon: "script",
        label: "Scripts",
      },
      {
        title: "Appointments",
        href: "/admin/dashboard/settings/appointments",
        icon: "appointments",
        label: "Appointments",
      },
    ],
  },
  {
    title: "Communication logs",
    href: "/admin/dashboard/communication-logs",
    icon: "communicationLogs",
    label: "Communication logs",
  },
];
