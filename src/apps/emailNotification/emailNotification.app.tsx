import { App } from "@/types";
import { EMAIL_NOTIFICATION_APP_NAME } from "./emailNotification.const";
import { Mailbox } from "lucide-react";
import { EmailNotificationAppSetup } from "./emailNotification.setup";

export const EmailNotificationApp: App = {
  name: EMAIL_NOTIFICATION_APP_NAME,
  displayName: "Email notifications",
  category: ["Notifications"],
  scope: ["appointment-hook"],
  type: "basic",
  Logo: ({ className }) => <Mailbox className={className} />,
  SetUp: (props) => <EmailNotificationAppSetup {...props} />,
  isFeatured: false,
  isHidden: false,
  dontAllowMultiple: true,
  description: {
    text: "Send email notifications with the appointment details to yourself.",
  },
};
