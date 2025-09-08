import { App } from "@vivid/types";
import { Mails } from "lucide-react";
import { CUSTOMER_EMAIL_NOTIFICATION_APP_NAME } from "./const";
import { CustomerEmailNotificationAppSetup } from "./setup";

export const CustomerEmailNotificationApp: App = {
  name: CUSTOMER_EMAIL_NOTIFICATION_APP_NAME,
  displayName: "customerEmailNotification.displayName",
  category: ["categories.notifications"],
  scope: ["appointment-hook"],
  type: "complex",
  Logo: ({ className }) => <Mails className={className} />,
  isFeatured: true,
  dontAllowMultiple: true,
  description: {
    text: "customerEmailNotification.description",
  },
  menuItems: [
    {
      href: "communications/customer-email",
      parent: "communications",
      id: "communications-customer-email",
      label: "navigation.customerEmailNotification",
      icon: <Mails />,
      Page: (props) => <CustomerEmailNotificationAppSetup {...props} />,
    },
  ],
  settingsHref: "communications/customer-email",
};
