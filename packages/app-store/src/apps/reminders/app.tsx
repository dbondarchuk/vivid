import type { AppsKeys } from "@vivid/i18n";
import { App } from "@vivid/types";
import { REMINDERS_APP_NAME } from "./const";
import { RemindersPage } from "./page";
import { BellRing } from "lucide-react";
import { NewReminderPage } from "./new-page";
import { EditReminderPage } from "./edit-page";

const reminderBreadcrumb = {
  title: "reminders.title" as AppsKeys,
  link: "/admin/dashboard/communications/reminders",
};

export const RemindersApp: App = {
  name: REMINDERS_APP_NAME,
  displayName: "reminders.displayName",
  scope: ["scheduled"],
  type: "complex",
  category: ["categories.notifications"],
  Logo: ({ className }) => <BellRing className={className} />,
  dontAllowMultiple: true,
  // isHidden: true,
  description: {
    text: "reminders.description",
  },
  menuItems: [
    {
      href: "communications/reminders",
      parent: "communications",
      id: "communications-reminders",
      order: 100,
      notScrollable: true,
      label: "navigation.reminders",
      icon: <BellRing />,
      Page: (props) => <RemindersPage {...props} />,
      pageBreadcrumbs: [reminderBreadcrumb],
      pageTitle: "reminders.title",
      pageDescription: "reminders.editDescription",
    },
    {
      href: "communications/reminders/new",
      parent: "communications",
      id: "communications-reminders-new",
      isHidden: true,
      label: "navigation.reminders",
      icon: <BellRing />,
      Page: (props) => <NewReminderPage {...props} />,
      pageBreadcrumbs: [
        reminderBreadcrumb,
        {
          title: "reminders.new",
          link: "/admin/dashboard/communications/reminders/new",
        },
      ],
      pageTitle: "reminders.new",
      pageDescription: "reminders.newDescription",
    },
    {
      href: "communications/reminders/edit",
      parent: "communications",
      id: "communications-reminders-new",
      isHidden: true,
      label: "navigation.reminders",
      icon: <BellRing />,
      Page: (props) => <EditReminderPage {...props} />,
      pageBreadcrumbs: [
        reminderBreadcrumb,
        {
          title: "reminders.edit",
          link: "/admin/dashboard/communications/reminders/edit",
        },
      ],
      pageTitle: "reminders.edit",
      pageDescription: "reminders.editDescription",
    },
  ],
  settingsHref: "communications/reminders",
};
