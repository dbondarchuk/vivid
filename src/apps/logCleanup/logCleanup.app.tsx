import { App } from "@/types";
import { LOG_CLEANUP_APP_NAME } from "./logCleanup.const";
import { LogCleanupAppSetup } from "./logCleanup.setup";
import { MessageCircleX } from "lucide-react";

export const LogCleanupApp: App = {
  name: LOG_CLEANUP_APP_NAME,
  displayName: "Logs clean up",
  scope: ["scheduled"],
  category: ["Utils"],
  type: "basic",
  Logo: ({ className }) => <MessageCircleX className={className} />,
  SetUp: (props) => <LogCleanupAppSetup {...props} />,
  isFeatured: false,
  dontAllowMultiple: true,
  description: {
    text: "Remove old logs on schedule.",
  },
};
