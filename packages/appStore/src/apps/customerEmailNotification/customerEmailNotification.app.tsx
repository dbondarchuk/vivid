import { App } from "@vivid/types";
import { CUSTOMER_EMAIL_NOTIFICATION_APP_NAME } from "./customerEmailNotification.const";
import { CustomerEmailNotificationAppSetup } from "./customerEmailNotification.setup";
import { Mails } from "lucide-react";

export const CustomerEmailNotificationApp: App = {
  name: CUSTOMER_EMAIL_NOTIFICATION_APP_NAME,
  displayName: "Customer email notifications",
  category: ["Notifications"],
  scope: ["appointment-hook"],
  type: "complex",
  Logo: ({ className }) => <Mails className={className} />,
  SetUp: (props) => <CustomerEmailNotificationAppSetup {...props} />,
  isFeatured: true,
  dontAllowMultiple: true,
  isHidden: true,
  description: {
    text: "Send an email with the appointment details to customers.",
  },
  menuItem: {
    href: "communications/customer-email",
    parent: "communications",
    id: "communications-customer-email",
    label: "Customer Email Notifications",
    icon: <Mails />,
  },
};
