import { App } from "@vivid/types";
import { GoogleCalendarLogo } from "./logo";
import { GoogleAppSetup } from "./setup";
import { GOOGLE_CALENDAR_APP_NAME } from "./const";

import image1 from "./images/1.png";
import image2 from "./images/2.png";

export const GoogleCalendarApp: App = {
  name: GOOGLE_CALENDAR_APP_NAME,
  displayName: "Google Calendar",
  scope: ["calendar-read", "calendar-write"],
  type: "oauth",
  category: ["Calendar", "Communications"],
  Logo: ({ className }) => <GoogleCalendarLogo className={className} />,
  SetUp: (props) => <GoogleAppSetup {...props} />,
  isFeatured: true,
  description: {
    text: `Google Calendar is a time management and scheduling service developed by Google.
  Allows users to create and edit events, with options available for type and time.
  Available to anyone that has a Gmail account on both mobile and web versions.`,
    images: [image1.src, image2.src],
  },
};
