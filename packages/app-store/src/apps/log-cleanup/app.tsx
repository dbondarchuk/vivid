import { App } from "@vivid/types";
import { LOG_CLEANUP_APP_NAME } from "./const";
import { LogCleanupAppSetup } from "./setup";
import { MessageCircleX } from "lucide-react";

export const LogCleanupApp: App = {
  name: LOG_CLEANUP_APP_NAME,
  displayName: "logCleanup.displayName",
  scope: ["scheduled"],
  category: ["categories.utilities"],
  type: "basic",
  Logo: ({ className }) => <MessageCircleX className={className} />,
  SetUp: (props) => <LogCleanupAppSetup {...props} />,
  isFeatured: false,
  dontAllowMultiple: true,
  description: {
    text: "logCleanup.description",
  },
};
