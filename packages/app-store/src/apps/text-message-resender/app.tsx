import { App } from "@vivid/types";
import { MessageCircleReply } from "lucide-react";
import { TEXT_MESSAGE_RESENDER_APP_NAME } from "./const";
import { TextMessageResenderAppSetup } from "./setup";

export const TextMessageResenderApp: App = {
  name: TEXT_MESSAGE_RESENDER_APP_NAME,
  displayName: "textMessageResender.displayName",
  scope: ["text-message-respond"],
  category: ["categories.communications"],
  type: "basic",
  Logo: ({ className }) => <MessageCircleReply className={className} />,
  SetUp: (props) => <TextMessageResenderAppSetup {...props} />,
  description: {
    text: "textMessageResender.description",
  },
};
