import { App } from "@vivid/types";
import { PaypalLogo } from "./logo";
import { PaypalAppSetup } from "./setup";
import { PAYPAL_APP_NAME } from "./const";

import image1 from "./images/1.png";

export const PaypalApp: App = {
  name: PAYPAL_APP_NAME,
  displayName: "paypal.displayName",
  scope: ["payment"],
  type: "basic",
  category: ["categories.payment"],
  Logo: ({ className }) => <PaypalLogo className={className} />,
  SetUp: (props) => <PaypalAppSetup {...props} />,
  isFeatured: true,
  description: {
    text: "paypal.description",
    images: [image1.src],
  },
};
