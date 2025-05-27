import { App } from "@vivid/types";
import { CUSTOMER_EMAIL_NOTIFICATION_APP_NAME } from "./const";
import { CustomerEmailNotificationAppSetup } from "./setup";
import { Mails } from "lucide-react";

export const CustomerEmailNotificationApp: App = {
  name: CUSTOMER_EMAIL_NOTIFICATION_APP_NAME,
  displayName: "Customer email notifications",
  category: ["Notifications"],
  scope: ["appointment-hook"],
  type: "complex",
  Logo: ({ className }) => <Mails className={className} />,
  isFeatured: true,
  dontAllowMultiple: true,
  description: {
    text: "Send an email with the appointment details to customers.",
  },
  menuItems: [
    {
      href: "communications/customer-email",
      parent: "communications",
      id: "communications-customer-email",
      label: "Customer Email Notifications",
      icon: <Mails />,
      Page: (props) => <CustomerEmailNotificationAppSetup {...props} />,
    },
  ],
  settingsHref: "communications/customer-email",
};
