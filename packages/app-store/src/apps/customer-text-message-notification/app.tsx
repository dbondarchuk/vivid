import { App } from "@vivid/types";
import { Send } from "lucide-react";
import { CUSTOMER_TEXT_MESSAGE_NOTIFICATION_APP_NAME } from "./const";
import { CustomerTextMessageNotificationAppSetup } from "./setup";

export const CustomerTextMessageNotificationApp: App = {
  name: CUSTOMER_TEXT_MESSAGE_NOTIFICATION_APP_NAME,
  displayName: "customerTextMessageNotification.displayName",
  scope: ["appointment-hook"],
  type: "complex",
  category: ["categories.notifications"],
  Logo: ({ className }) => <Send className={className} />,
  isFeatured: true,
  dontAllowMultiple: true,
  description: {
    text: "customerTextMessageNotification.description",
  },
  menuItems: [
    {
      href: "communications/customer-text-message",
      parent: "communications",
      id: "communications-customer-text-message",
      label: "navigation.customerTextMessageNotification",
      icon: <Send />,
      Page: (props) => <CustomerTextMessageNotificationAppSetup {...props} />,
    },
  ],
  settingsHref: "communications/customer-text-message",
};
