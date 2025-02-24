import { App } from "@vivid/types";
import { REMINDERS_APP_NAME } from "./const";
import { RemindersAppSetup } from "./setup";
import { BellRing } from "lucide-react";

export const RemindersApp: App = {
  name: REMINDERS_APP_NAME,
  displayName: "Customer reminders",
  scope: ["scheduled"],
  type: "complex",
  category: ["Notifications"],
  Logo: ({ className }) => <BellRing className={className} />,
  dontAllowMultiple: true,
  isHidden: true,
  description: {
    text: "Send appointment reminders to customers.",
  },
  menuItems: [
    {
      href: "communications/reminders",
      parent: "communications",
      id: "communications-reminders",
      order: 100,
      label: "Reminders",
      icon: <BellRing />,
      Page: (props) => <RemindersAppSetup {...props} />,
      pageBreadcrumbs: [
        {
          title: "Reminders",
          link: "/admin/dashboard/communications/reminders",
        },
      ],
      pageTitle: "Reminders",
      pageDescription: "Add or update appointment reminders",
    },
  ],
};
