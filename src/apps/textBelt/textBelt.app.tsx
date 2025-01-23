import { App } from "@/types";
import { TEXTBELT_APP_NAME } from "./textBelt.const";
import { TextBeltLogo } from "./textBelt.logo";
import { TextBeltAppSetup } from "./textBelt.setup";

export const TextBeltApp: App = {
  name: TEXTBELT_APP_NAME,
  displayName: "TextBelt SMS",
  scope: ["text-message-send"],
  type: "basic",
  Logo: ({ className }) => <TextBeltLogo className={className} />,
  SetUp: (props) => <TextBeltAppSetup {...props} />,
};
