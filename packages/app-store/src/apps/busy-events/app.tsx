import { App } from "@vivid/types";
import { CalendarX2 } from "lucide-react";
import { BUSY_EVENTS_APP_NAME } from "./const";
import { BusyEventsAppSetup } from "./setup";

export const BusyEventsApp: App = {
  name: BUSY_EVENTS_APP_NAME,
  displayName: "busyEvents.displayName",
  scope: ["calendar-read"],
  type: "complex",
  category: ["categories.schedule"],
  Logo: ({ className }) => <CalendarX2 className={className} />,
  isFeatured: true,
  dontAllowMultiple: true,
  description: {
    text: "busyEvents.description",
  },
  menuItems: [
    {
      href: "settings/schedule/busy-events",
      parent: "schedule",
      id: "schedule-busy-events",
      label: "navigation.busyEvents",
      pageTitle: "busyEvents.title",
      pageDescription: "busyEvents.description",
      pageBreadcrumbs: [
        {
          title: "busyEvents.title",
          link: "/admin/dashboard/settings/schedule/busy-events",
        },
      ],
      icon: <CalendarX2 />,
      Page: (props) => <BusyEventsAppSetup {...props} />,
    },
  ],
  settingsHref: "settings/schedule/busy-events",
};
