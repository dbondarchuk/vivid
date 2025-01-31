import { App } from "@/types";
import { REMINDERS_APP_NAME } from "./reminders.const";
import { RemindersAppSetup } from "./reminders.setup";
import { BellRing } from "lucide-react";

export const RemindersApp: App = {
  name: REMINDERS_APP_NAME,
  displayName: "Customer reminders",
  scope: ["scheduled"],
  type: "complex",
  category: ["Notifications"],
  Logo: ({ className }) => <BellRing className={className} />,
  SetUp: (props) => <RemindersAppSetup {...props} />,
  dontAllowMultiple: true,
  isHidden: true,
  description: {
    text: "Send appointment reminders to customers.",
  },
  menuItem: {
    href: "communications/reminders",
    parent: "communications",
    id: "communications-reminders",
    label: "Reminders",
    icon: "BellRing",
  },
};
