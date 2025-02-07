import { App } from "@vivid/types";
import { CUSTOMER_TEXT_MESSAGE_NOTIFICATION_APP_NAME } from "./customerTextMessageNotification.const";
import { CustomerTextMessageNotificationAppSetup } from "./customerTextMessageNotification.setup";
import { Send } from "lucide-react";

export const CustomerTextMessageNotificationApp: App = {
  name: CUSTOMER_TEXT_MESSAGE_NOTIFICATION_APP_NAME,
  displayName: "Customer text message notifications",
  scope: ["appointment-hook"],
  type: "complex",
  category: ["Notifications"],
  Logo: ({ className }) => <Send className={className} />,
  SetUp: (props) => <CustomerTextMessageNotificationAppSetup {...props} />,
  isFeatured: true,
  dontAllowMultiple: true,
  isHidden: true,
  description: {
    text: "Send a text message with the appointment details to customers.",
  },
  menuItem: {
    href: "communications/customer-text-message",
    parent: "communications",
    id: "communications-customer-text-message",
    label: "Customer Text Message Notifications",
    icon: <Send />,
  },
};
