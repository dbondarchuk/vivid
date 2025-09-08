import { App } from "@vivid/types";
import { CalendarDays } from "lucide-react";
import { WEEKLY_SCHEDULE_APP_NAME } from "./const";
import { WeeklyScheduleAppSetup } from "./setup";

export const WeeklyScheduleApp: App = {
  name: WEEKLY_SCHEDULE_APP_NAME,
  displayName: "weeklySchedule.displayName",
  scope: ["schedule"],
  type: "complex",
  category: ["categories.schedule"],
  Logo: ({ className }) => <CalendarDays className={className} />,
  isFeatured: true,
  dontAllowMultiple: true,
  description: {
    text: "weeklySchedule.description",
  },
  menuItems: [
    {
      href: "settings/schedule/weekly",
      parent: "schedule",
      id: "schedule-weekly",
      label: "navigation.weeklySchedule",
      pageTitle: "weeklySchedule.displayName",
      pageDescription: "weeklySchedule.form.setCustomWeeklySchedule",
      pageBreadcrumbs: [
        {
          title: "weeklySchedule.displayName",
          link: "/admin/dashboard/settings/schedule/weekly",
        },
      ],
      icon: <CalendarDays />,
      Page: (props) => <WeeklyScheduleAppSetup {...props} />,
    },
  ],
  settingsHref: "settings/schedule/weekly",
};
