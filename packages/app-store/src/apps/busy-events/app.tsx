import { App } from "@vivid/types";
import { CalendarX2 } from "lucide-react";
import { BUSY_EVENTS_APP_NAME } from "./const";
import { BusyEventsAppSetup } from "./setup";

export const BusyEventsApp: App = {
  name: BUSY_EVENTS_APP_NAME,
  displayName: "Busy events",
  scope: ["calendar-read"],
  type: "complex",
  category: ["Schedule"],
  Logo: ({ className }) => <CalendarX2 className={className} />,
  isFeatured: true,
  dontAllowMultiple: true,
  description: {
    text: "Busy events app allows users to block specific dates and time in their availability",
  },
  menuItems: [
    {
      href: "settings/schedule/busy-events",
      parent: "schedule",
      id: "schedule-busy-events",
      label: "Busy events",
      pageTitle: "Busy events",
      pageDescription: "Set custom blocked times on your schedule",
      pageBreadcrumbs: [
        {
          title: "Busy events",
          link: "/admin/dashboard/settings/schedule/busy-events",
        },
      ],
      icon: <CalendarX2 />,
      Page: (props) => <BusyEventsAppSetup {...props} />,
    },
  ],
  settingsHref: "settings/schedule/busy-events",
};
