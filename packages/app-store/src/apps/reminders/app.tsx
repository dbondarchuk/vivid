import { App } from "@vivid/types";
import { REMINDERS_APP_NAME } from "./const";
import { RemindersPage } from "./page";
import { BellRing } from "lucide-react";
import { NewReminderPage } from "./new-page";
import { EditReminderPage } from "./edit-page";

const reminderBreadcrumb = {
  title: "Reminders",
  link: "/admin/dashboard/communications/reminders",
};

export const RemindersApp: App = {
  name: REMINDERS_APP_NAME,
  displayName: "Customer reminders",
  scope: ["scheduled"],
  type: "complex",
  category: ["Notifications"],
  Logo: ({ className }) => <BellRing className={className} />,
  dontAllowMultiple: true,
  // isHidden: true,
  description: {
    text: "Send appointment reminders to customers.",
  },
  menuItems: [
    {
      href: "communications/reminders",
      parent: "communications",
      id: "communications-reminders",
      order: 100,
      notScrollable: true,
      label: "Reminders",
      icon: <BellRing />,
      Page: (props) => <RemindersPage {...props} />,
      pageBreadcrumbs: [reminderBreadcrumb],
      pageTitle: "Reminders",
      pageDescription: "Add or update appointment reminders",
    },
    {
      href: "communications/reminders/new",
      parent: "communications",
      id: "communications-reminders-new",
      isHidden: true,
      label: "Reminders",
      icon: <BellRing />,
      Page: (props) => <NewReminderPage {...props} />,
      pageBreadcrumbs: [
        reminderBreadcrumb,
        {
          title: "New reminder",
          link: "/admin/dashboard/communications/reminders/new",
        },
      ],
      pageTitle: "New reminder",
      pageDescription: "Create new appointment reminder",
    },
    {
      href: "communications/reminders/edit",
      parent: "communications",
      id: "communications-reminders-new",
      isHidden: true,
      label: "Reminders",
      icon: <BellRing />,
      Page: (props) => <EditReminderPage {...props} />,
      pageBreadcrumbs: [
        reminderBreadcrumb,
        {
          title: "Edit reminder",
          link: "/admin/dashboard/communications/reminders/edit",
        },
      ],
      pageTitle: "Edit reminder",
      pageDescription: "Update appointment reminder",
    },
  ],
  settingsHref: "communications/reminders",
};
