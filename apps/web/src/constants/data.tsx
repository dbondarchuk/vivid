import { NavItemGroup, NavItemWithOptionalChildren } from "@vivid/types";
import {
  ArrowDownToLine,
  BadgeDollarSign,
  Blocks,
  BookUser,
  Boxes,
  Brush,
  Calendar,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  Code2,
  Cog,
  Globe,
  Grid2X2Plus,
  HandPlatter,
  Instagram,
  LayoutDashboard,
  LayoutTemplate,
  MailSearch,
  Paintbrush,
  PanelBottom,
  PanelTop,
  Paperclip,
  Send,
  Settings,
  Store,
  TextCursorInput,
} from "lucide-react";

export const navItems: NavItemGroup[] = [
  {
    title: "Overview",
    children: [
      {
        id: "dashboard",
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: <LayoutDashboard />,
        label: "Dashboard",
      },
    ],
  },
  {
    title: "Appointments",
    children: [
      {
        id: "appointments",
        title: "Appointments",
        href: "/admin/dashboard/appointments",
        icon: <CalendarClock />,
        label: "Appointments",
      },
      {
        id: "schedule",
        title: "Schedule",
        icon: <Calendar />,
        items: [
          {
            id: "schedule-base",
            title: "Default schedule",
            href: "/admin/dashboard/settings/schedule",
            label: "Default schedule",
            icon: <CalendarRange />,
          },
        ],
      },
      {
        id: "services",
        title: "Services",
        icon: <HandPlatter />,
        items: [
          {
            id: "services-fields",
            title: "Fields",
            href: "/admin/dashboard/services/fields",
            label: "Fields",
            icon: <TextCursorInput />,
          },
          {
            id: "services-addons",
            title: "Addons",
            href: "/admin/dashboard/services/addons",
            label: "Addons",
            icon: <Grid2X2Plus />,
          },
          {
            id: "services-options",
            title: "Options",
            href: "/admin/dashboard/services/options",
            label: "Options",
            icon: <HandPlatter />,
          },
          {
            id: "discounts",
            title: "Discounts",
            href: "/admin/dashboard/services/discounts",
            label: "Discounts",
            icon: <BadgeDollarSign />,
          },
        ],
      },
    ],
  },
  {
    title: "Customers",
    children: [
      {
        id: "customers",
        title: "Customers",
        href: "/admin/dashboard/customers",
        icon: <BookUser />,
        label: "Customers",
      },
    ],
  },
  {
    title: "Website",
    children: [
      {
        id: "pages",
        title: "Pages",
        href: "/admin/dashboard/pages",
        icon: <Globe />,
        label: "Pages",
      },
      {
        id: "assets",
        title: "Assets",
        href: "/admin/dashboard/assets",
        icon: <Paperclip />,
        label: "Assets",
      },

      {
        id: "appearance",
        title: "Appearance",
        icon: <Paintbrush />,
        items: [
          {
            id: "appearance-styling",
            title: "Styling",
            href: "/admin/dashboard/appearence/styling",
            icon: <Brush />,
            label: "styling",
          },
          {
            id: "appearance-header",
            title: "Header",
            href: "/admin/dashboard/appearence/header",
            icon: <PanelTop />,
            label: "Header",
          },
          {
            id: "appearance-footer",
            title: "Footer",
            href: "/admin/dashboard/appearence/footer",
            icon: <PanelBottom />,
            label: "Footer",
          },
        ],
      },
    ],
  },
  {
    title: "Settings",
    children: [
      {
        id: "settings",
        title: "Settings",
        icon: <Settings />,
        items: [
          {
            id: "settings-general",
            title: "General",
            href: "/admin/dashboard/settings/general",
            icon: <Cog />,
            label: "General",
          },
          {
            id: "settings-social",
            title: "Social",
            href: "/admin/dashboard/settings/social",
            icon: <Instagram />,
            label: "Social",
          },
          {
            id: "settings-scripts",
            title: "Scripts",
            href: "/admin/dashboard/settings/scripts",
            icon: <Code2 />,
            label: "Scripts",
          },
          {
            id: "settings-appointments",
            title: "Appointments",
            href: "/admin/dashboard/settings/appointments",
            icon: <CalendarClock />,
            label: "Appointments",
          },
        ],
      },

      {
        id: "communications",
        icon: <Send />,
        title: "Communications",
        items: [
          {
            id: "templates",
            title: "Templates",
            href: "/admin/dashboard/templates",
            icon: <LayoutTemplate />,
            label: "Templates",
          },
          {
            id: "communications-logs",
            title: "Logs",
            href: "/admin/dashboard/communication-logs",
            icon: <MailSearch />,
            label: "Communication logs",
          },
        ],
      },
      {
        id: "apps",
        title: "Apps",
        icon: <Blocks />,
        label: "Apps",
        items: [
          {
            id: "apps-installed",
            title: "Installed apps",
            href: "/admin/dashboard/apps",
            icon: <ArrowDownToLine />,
            label: "Installed apps",
          },
          {
            id: "apps-store",
            title: "Store",
            href: "/admin/dashboard/apps/store",
            icon: <Store />,
            label: "Store",
          },
          {
            id: "apps-default",
            title: "Default apps",
            href: "/admin/dashboard/apps/default",
            icon: <Boxes />,
            label: "Default apps",
          },
        ],
      },
    ],
  },
];

// export const navItems: NavItemWithOptionalChildren[] = [

// ];
