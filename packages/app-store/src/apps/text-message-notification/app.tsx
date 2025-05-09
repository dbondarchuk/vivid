import { App } from "@vivid/types";
import { TEXT_MESSAGE_NOTIFICATION_APP_NAME } from "./const";
import { TextMessageNotificationAppSetup } from "./setup";
import { SendHorizonal } from "lucide-react";

export const TextMessageNotificationApp: App = {
  name: TEXT_MESSAGE_NOTIFICATION_APP_NAME,
  displayName: "Text message appointment notifications",
  scope: ["appointment-hook"],
  category: ["Notifications"],
  type: "basic",
  Logo: ({ className }) => <SendHorizonal className={className} />,
  SetUp: (props) => <TextMessageNotificationAppSetup {...props} />,
  isFeatured: true,
  dontAllowMultiple: true,
  description: {
    text: "Send a text message about new appointments to yourself.",
  },
};
