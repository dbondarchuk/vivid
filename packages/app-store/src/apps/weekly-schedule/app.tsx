import { App } from "@vivid/types";
import { WEEKLY_SCHEDULE_APP_NAME } from "./const";
import { WeeklyScheduleAppSetup } from "./setup";
import { CalendarDays } from "lucide-react";

export const WeeklyScheduleApp: App = {
  name: WEEKLY_SCHEDULE_APP_NAME,
  displayName: "Weekly schedule",
  scope: ["schedule"],
  type: "complex",
  category: ["Schedule"],
  Logo: ({ className }) => <CalendarDays className={className} />,
  isFeatured: true,
  dontAllowMultiple: true,
  description: {
    text: "Weekly schedule app allows users to create their working schedule for each individual week",
  },
  menuItems: [
    {
      href: "settings/schedule/weekly",
      parent: "schedule",
      id: "schedule-weekly",
      label: "Weekly schedule",
      pageTitle: "Weekly schedule",
      pageDescription: "Set custom weekly schedule",
      pageBreadcrumbs: [
        {
          title: "Weekly schedule",
          link: "/admin/dashboard/settings/schedule/weekly",
        },
      ],
      icon: <CalendarDays />,
      Page: (props) => <WeeklyScheduleAppSetup {...props} />,
    },
  ],
  settingsHref: "settings/schedule/weekly",
};
