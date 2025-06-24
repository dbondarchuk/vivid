import { App } from "@vivid/types";
import { CALDAV_APP_NAME } from "./const";
import { CaldavLogo } from "./logo";
import { CaldavAppSetup } from "./setup";
import image from "./images/image.png";

export const CaldavApp: App = {
  name: CALDAV_APP_NAME,
  displayName: "calDav.displayName",
  category: ["categories.schedule"],
  scope: ["calendar-read", "calendar-write"],
  type: "basic",
  Logo: ({ className }) => <CaldavLogo className={className} />,
  SetUp: (props) => <CaldavAppSetup {...props} />,
  isFeatured: true,
  description: {
    text: "calDav.description",
    images: [image.src],
  },
};
