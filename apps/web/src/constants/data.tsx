import { NavItemGroup } from "@vivid/types";
import {
  ArrowDownToLine,
  BadgeDollarSign,
  Blocks,
  BookUser,
  Boxes,
  Brush,
  Calendar,
  CalendarClock,
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
    title: "navigation.overview",
    children: [
      {
        id: "dashboard",
        title: "navigation.dashboard",
        href: "/admin/dashboard",
        icon: <LayoutDashboard />,
        label: "navigation.dashboard",
      },
    ],
  },
  {
    title: "navigation.appointments",
    children: [
      {
        id: "appointments",
        title: "navigation.appointments",
        href: "/admin/dashboard/appointments",
        icon: <CalendarClock />,
        label: "navigation.appointments",
      },
      {
        id: "schedule",
        title: "navigation.schedule",
        icon: <Calendar />,
        items: [
          {
            id: "schedule-base",
            title: "navigation.defaultSchedule",
            href: "/admin/dashboard/settings/schedule",
            label: "navigation.defaultSchedule",
            icon: <CalendarRange />,
          },
        ],
      },
      {
        id: "services",
        title: "navigation.services",
        icon: <HandPlatter />,
        items: [
          {
            id: "services-fields",
            title: "navigation.fields",
            href: "/admin/dashboard/services/fields",
            label: "navigation.fields",
            icon: <TextCursorInput />,
          },
          {
            id: "services-addons",
            title: "navigation.addons",
            href: "/admin/dashboard/services/addons",
            label: "navigation.addons",
            icon: <Grid2X2Plus />,
          },
          {
            id: "services-options",
            title: "navigation.options",
            href: "/admin/dashboard/services/options",
            label: "navigation.options",
            icon: <HandPlatter />,
          },
          {
            id: "discounts",
            title: "navigation.discounts",
            href: "/admin/dashboard/services/discounts",
            label: "navigation.discounts",
            icon: <BadgeDollarSign />,
          },
        ],
      },
    ],
  },
  {
    title: "navigation.customers",
    children: [
      {
        id: "customers",
        title: "navigation.customers",
        href: "/admin/dashboard/customers",
        icon: <BookUser />,
        label: "navigation.customers",
      },
    ],
  },
  {
    title: "navigation.website",
    children: [
      {
        id: "pages",
        title: "navigation.pages",
        href: "/admin/dashboard/pages",
        icon: <Globe />,
        label: "navigation.pages",
      },
      {
        id: "assets",
        title: "navigation.assets",
        href: "/admin/dashboard/assets",
        icon: <Paperclip />,
        label: "navigation.assets",
      },

      {
        id: "appearance",
        title: "navigation.appearance",
        icon: <Paintbrush />,
        items: [
          {
            id: "appearance-styling",
            title: "navigation.styling",
            href: "/admin/dashboard/appearence/styling",
            icon: <Brush />,
            label: "navigation.styling",
          },
          {
            id: "appearance-header",
            title: "navigation.header",
            href: "/admin/dashboard/appearence/header",
            icon: <PanelTop />,
            label: "navigation.header",
          },
          {
            id: "appearance-footer",
            title: "navigation.footer",
            href: "/admin/dashboard/appearence/footer",
            icon: <PanelBottom />,
            label: "navigation.footer",
          },
        ],
      },
    ],
  },
  {
    title: "navigation.settings",
    children: [
      {
        id: "settings",
        title: "navigation.settings",
        icon: <Settings />,
        items: [
          {
            id: "settings-general",
            title: "navigation.general",
            href: "/admin/dashboard/settings/general",
            icon: <Cog />,
            label: "navigation.general",
          },
          {
            id: "settings-social",
            title: "navigation.social",
            href: "/admin/dashboard/settings/social",
            icon: <Instagram />,
            label: "navigation.social",
          },
          {
            id: "settings-scripts",
            title: "navigation.scripts",
            href: "/admin/dashboard/settings/scripts",
            icon: <Code2 />,
            label: "navigation.scripts",
          },
          {
            id: "settings-appointments",
            title: "navigation.appointments",
            href: "/admin/dashboard/settings/appointments",
            icon: <CalendarClock />,
            label: "navigation.appointments",
          },
        ],
      },

      {
        id: "communications",
        icon: <Send />,
        title: "navigation.communications",
        items: [
          {
            id: "templates",
            title: "navigation.templates",
            href: "/admin/dashboard/templates",
            icon: <LayoutTemplate />,
            label: "navigation.templates",
          },
          {
            id: "communications-logs",
            title: "navigation.logs",
            href: "/admin/dashboard/communication-logs",
            icon: <MailSearch />,
            label: "navigation.communicationLogs",
          },
        ],
      },
      {
        id: "apps",
        title: "navigation.apps",
        icon: <Blocks />,
        label: "navigation.apps",
        items: [
          {
            id: "apps-installed",
            title: "navigation.installedApps",
            href: "/admin/dashboard/apps",
            icon: <ArrowDownToLine />,
            label: "navigation.installedApps",
          },
          {
            id: "apps-store",
            title: "navigation.store",
            href: "/admin/dashboard/apps/store",
            icon: <Store />,
            label: "navigation.store",
          },
          {
            id: "apps-default",
            title: "navigation.defaultApps",
            href: "/admin/dashboard/apps/default",
            icon: <Boxes />,
            label: "navigation.defaultApps",
          },
        ],
      },
    ],
  },
];

// export const navItems: NavItemWithOptionalChildren[] = [

// ];
