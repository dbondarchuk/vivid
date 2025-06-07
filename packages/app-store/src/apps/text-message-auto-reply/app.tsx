import { App } from "@vivid/types";
import { MessageSquareReply } from "lucide-react";
import { TEXT_MESSAGE_AUTO_REPLY_APP_NAME } from "./const";
import { TextMessageAutoReplyAppSetup } from "./setup";

export const TextMessageAutoReplyApp: App = {
  name: TEXT_MESSAGE_AUTO_REPLY_APP_NAME,
  displayName: "Text message auto reply",
  scope: ["text-message-respond"],
  category: ["Communications"],
  type: "basic",
  Logo: ({ className }) => <MessageSquareReply className={className} />,
  SetUp: (props) => <TextMessageAutoReplyAppSetup {...props} />,
  description: {
    text: "Text message auto reply will send and automatic reply when your customers reply to automatic text messages. It can be used to let customers know that phone number is unmonitored",
  },
};
