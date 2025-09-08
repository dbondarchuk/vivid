import { App } from "@vivid/types";
import { Mailbox } from "lucide-react";
import { EMAIL_NOTIFICATION_APP_NAME } from "./const";
import { EmailNotificationAppSetup } from "./setup";

export const EmailNotificationApp: App = {
  name: EMAIL_NOTIFICATION_APP_NAME,
  displayName: "emailNotification.displayName",
  category: ["categories.notifications"],
  scope: ["appointment-hook"],
  type: "basic",
  Logo: ({ className }) => <Mailbox className={className} />,
  SetUp: (props) => <EmailNotificationAppSetup {...props} />,
  isFeatured: false,
  isHidden: false,
  dontAllowMultiple: true,
  description: {
    text: "emailNotification.description",
  },
};
