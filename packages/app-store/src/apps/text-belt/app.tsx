import { App } from "@vivid/types";
import { TEXTBELT_APP_NAME } from "./const";
import { TextBeltLogo } from "./logo";
import { TextBeltAppSetup } from "./setup";
import image from "./images/image.png";

export const TextBeltApp: App = {
  name: TEXTBELT_APP_NAME,
  displayName: "textBelt.displayName",
  scope: ["text-message-send"],
  category: ["categories.communications"],
  type: "basic",
  Logo: ({ className }) => <TextBeltLogo className={className} />,
  SetUp: (props) => <TextBeltAppSetup {...props} />,
  description: {
    text: "textBelt.description",
    images: [image.src],
  },
};
