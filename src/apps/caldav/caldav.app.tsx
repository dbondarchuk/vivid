import { App } from "@/types";
import { CALDAV_APP_NAME } from "./caldav.const";
import { CaldavLogo } from "./caldav.logo";
import { CaldavAppSetup } from "./caldav.setup";

export const CaldavApp: App = {
  name: CALDAV_APP_NAME,
  displayName: "CalDAV Calendar",
  scope: ["calendar-read"],
  type: "basic",
  Logo: ({ className }) => <CaldavLogo className={className} />,
  SetUp: (props) => <CaldavAppSetup {...props} />,
};
