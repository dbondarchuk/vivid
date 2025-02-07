import { App } from "@vivid/types";
import { OutlookLogo } from "./outlook.logo";
import { OutlookAppSetup } from "./outlook.setup";
import { OUTLOOK_APP_NAME } from "./outlook.const";

import image1 from "./images/1.jpg";
import image2 from "./images/2.jpg";
import image3 from "./images/3.jpg";
import image4 from "./images/4.jpg";

export const OutlookApp: App = {
  name: OUTLOOK_APP_NAME,
  displayName: "Outlook",
  scope: ["calendar-read", "calendar-write", "mail-send"],
  type: "oauth",
  category: ["Calendar", "Communications"],
  Logo: ({ className }) => <OutlookLogo className={className} />,
  SetUp: (props) => <OutlookAppSetup {...props} />,
  isFeatured: true,
  description: {
    text: `Microsoft Office 365 is a suite of apps that helps you stay connected with others and get things done.
It includes but is not limited to Microsoft Word, PowerPoint, Excel, Teams, OneNote and OneDrive. 
Office 365 allows you to work remotely with others on a team and collaborate in an online environment.
Both web versions and desktop/mobile applications are available.`,
    images: [image1.src, image2.src, image3.src, image4.src],
  },
};
