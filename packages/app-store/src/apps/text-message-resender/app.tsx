import { App } from "@vivid/types";
import { MessageCircleReply, MessageSquareReply } from "lucide-react";
import { TEXT_MESSAGE_RESENDER_APP_NAME } from "./const";
import { TextMessageResenderAppSetup } from "./setup";

export const TextMessageResenderApp: App = {
  name: TEXT_MESSAGE_RESENDER_APP_NAME,
  displayName: "Text message resender",
  scope: ["text-message-respond"],
  category: ["Communications"],
  type: "basic",
  Logo: ({ className }) => <MessageCircleReply className={className} />,
  SetUp: (props) => <TextMessageResenderAppSetup {...props} />,
  description: {
    text: "Text message resender will route customer text messages replies to your phone number and lets you reply to them directly",
  },
};
