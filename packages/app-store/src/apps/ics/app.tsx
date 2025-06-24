import { App } from "@vivid/types";
import { ICS_APP_NAME } from "./const";
import { IcsLogo } from "./logo";
import { IcsAppSetup } from "./setup";

export const IcsApp: App = {
  name: ICS_APP_NAME,
  displayName: "ics.displayName",
  scope: ["calendar-read"],
  category: ["categories.calendar"],
  type: "basic",
  Logo: ({ className }) => <IcsLogo className={className} />,
  SetUp: (props) => <IcsAppSetup {...props} />,
  isFeatured: true,
  description: {
    text: "ics.description",
  },
};
