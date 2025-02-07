import { App } from "@vivid/types";
import { TEXTBELT_APP_NAME } from "./textBelt.const";
import { TextBeltLogo } from "./textBelt.logo";
import { TextBeltAppSetup } from "./textBelt.setup";
import image from "./images/image.png";

export const TextBeltApp: App = {
  name: TEXTBELT_APP_NAME,
  displayName: "TextBelt SMS",
  scope: ["text-message-send"],
  category: ["Communications"],
  type: "basic",
  Logo: ({ className }) => <TextBeltLogo className={className} />,
  SetUp: (props) => <TextBeltAppSetup {...props} />,
  description: {
    text: "Textbelt is a no-nonsense SMS API built for developers who just want to send SMS. Thousands of customers prefer Textbelt over other SMS providers for our ease of setup, simple, predictable pricing packages, and personal support",
    images: [image.src],
  },
};
