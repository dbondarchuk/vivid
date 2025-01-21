import { App } from "@/types";
import { ICS_APP_NAME } from "./ics.const";
import { IcsLogo } from "./ics.logo";
import { IcsAppSetup } from "./ics.setup";

export const IcsApp: App = {
  name: ICS_APP_NAME,
  displayName: "ICS Calendar",
  scope: ["calendar-read"],
  type: "basic",
  Logo: ({ className }) => <IcsLogo className={className} />,
  SetUp: (props) => <IcsAppSetup {...props} />,
};
