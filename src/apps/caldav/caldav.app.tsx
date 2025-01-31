import { App } from "@/types";
import { CALDAV_APP_NAME } from "./caldav.const";
import { CaldavLogo } from "./caldav.logo";
import { CaldavAppSetup } from "./caldav.setup";
import image from "./images/image.png";

export const CaldavApp: App = {
  name: CALDAV_APP_NAME,
  displayName: "CalDAV Calendar",
  category: ["Calendar"],
  scope: ["calendar-read"],
  type: "basic",
  Logo: ({ className }) => <CaldavLogo className={className} />,
  SetUp: (props) => <CaldavAppSetup {...props} />,
  isFeatured: true,
  description: {
    text: `Caldav is a protocol that allows different clients/servers to access scheduling information on remote servers as well as schedule meetings with other users on the same server or other servers.
It extends WebDAV specification and uses iCalendar format for the data.`,
    images: [image.src],
  },
};
