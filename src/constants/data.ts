import { NavItemWithOptionalChildren } from "@/types";

export const navItems: NavItemWithOptionalChildren[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: "LayoutDashboard",
    label: "Dashboard",
  },
  {
    id: "appointments",
    title: "Appointments",
    href: "/admin/dashboard/appointments",
    icon: "CalendarClock",
    label: "Appointments",
  },
  {
    id: "assets",
    title: "Assets",
    href: "/admin/dashboard/assets",
    icon: "Paperclip",
    label: "Assets",
  },
  {
    id: "pages",
    title: "Pages",
    href: "/admin/dashboard/pages",
    icon: "Globe",
    label: "Pages",
  },
  {
    id: "appearance",
    title: "Appearance",
    icon: "Paintbrush",
    items: [
      {
        id: "appearance-styling",
        title: "Styling",
        href: "/admin/dashboard/appearence/styling",
        icon: "Brush",
        label: "styling",
      },
      {
        id: "appearance-header",
        title: "Header",
        href: "/admin/dashboard/appearence/header",
        icon: "PanelTop",
        label: "Header",
      },
      {
        id: "appearance-footer",
        title: "Footer",
        href: "/admin/dashboard/appearence/footer",
        icon: "PanelBottom",
        label: "Footer",
      },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    icon: "Settings",
    items: [
      {
        id: "settings-general",
        title: "General",
        href: "/admin/dashboard/settings/general",
        icon: "Cog",
        label: "General",
      },
      {
        id: "settings-social",
        title: "Social",
        href: "/admin/dashboard/settings/social",
        icon: "Instagram",
        label: "Social",
      },
      {
        id: "settings-scripts",
        title: "Scripts",
        href: "/admin/dashboard/settings/scripts",
        icon: "Code",
        label: "Scripts",
      },
      {
        id: "settings-appointments",
        title: "Appointments",
        href: "/admin/dashboard/settings/appointments",
        icon: "CalendarClock",
        label: "Appointments",
      },
      {
        id: "settings-default-apps",
        title: "Default apps",
        href: "/admin/dashboard/apps/default",
        icon: "Boxes",
        label: "Default apps",
      },
    ],
  },
  {
    id: "communications",
    icon: "Send",
    title: "Communications",
    items: [
      {
        id: "communications-logs",
        title: "Communication logs",
        href: "/admin/dashboard/communication-logs",
        icon: "MailSearch",
        label: "Communication logs",
      },
    ],
  },
  {
    id: "apps",
    title: "Apps",
    href: "/admin/dashboard/apps",
    icon: "Blocks",
    label: "Apps",
  },
];
