import { App } from "@vivid/types";
import { MessageSquareReply } from "lucide-react";
import { TEXT_MESSAGE_AUTO_REPLY_APP_NAME } from "./const";
import { TextMessageAutoReplyAppSetup } from "./setup";

export const TextMessageAutoReplyApp: App = {
  name: TEXT_MESSAGE_AUTO_REPLY_APP_NAME,
  displayName: "textMessageAutoReply.displayName",
  scope: ["text-message-respond"],
  category: ["categories.communications"],
  type: "basic",
  Logo: ({ className }) => <MessageSquareReply className={className} />,
  SetUp: (props) => <TextMessageAutoReplyAppSetup {...props} />,
  description: {
    text: "textMessageAutoReply.description",
  },
};
