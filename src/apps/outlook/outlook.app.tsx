import { App } from "@/types";
import { OutlookLogo } from "./outlook.logo";
import { OutlookAppSetup } from "./outlook.setup";
import { OUTLOOK_APP_NAME } from "./outlook.const";

export const OutlookApp: App = {
  name: OUTLOOK_APP_NAME,
  displayName: "Outlook",
  scope: ["calendar-read", "mail-send", "calendar-write"],
  type: "oauth",
  Logo: ({ className }) => <OutlookLogo className={className} />,
  SetUp: (props) => <OutlookAppSetup {...props} />,
};
