import { App } from "@vivid/types";
import { GOOGLE_CALENDAR_APP_NAME } from "./const";
import { GoogleCalendarLogo } from "./logo";
import { GoogleAppSetup } from "./setup";

import image1 from "./images/1.png";
import image2 from "./images/2.png";

export const GoogleCalendarApp: App = {
  name: GOOGLE_CALENDAR_APP_NAME,
  displayName: "googleCalendar.displayName",
  scope: ["calendar-read", "calendar-write"],
  type: "oauth",
  category: ["categories.calendar", "categories.communications"],
  Logo: ({ className }) => <GoogleCalendarLogo className={className} />,
  SetUp: (props) => <GoogleAppSetup {...props} />,
  isFeatured: true,
  description: {
    text: "googleCalendar.description",
    images: [image1.src, image2.src],
  },
};
