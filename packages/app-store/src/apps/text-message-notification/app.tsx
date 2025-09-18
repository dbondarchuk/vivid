import { App } from "@vivid/types";
import { SendHorizonal } from "lucide-react";
import { TEXT_MESSAGE_NOTIFICATION_APP_NAME } from "./const";
import { TextMessageNotificationAppSetup } from "./setup";

export const TextMessageNotificationApp: App = {
  name: TEXT_MESSAGE_NOTIFICATION_APP_NAME,
  displayName: "textMessageNotification.displayName",
  scope: ["appointment-hook"],
  category: ["categories.notifications"],
  type: "basic",
  Logo: ({ className }) => <SendHorizonal className={className} />,
  SetUp: (props) => <TextMessageNotificationAppSetup {...props} />,
  isFeatured: true,
  dontAllowMultiple: true,
  description: {
    text: "textMessageNotification.description",
  },
};
