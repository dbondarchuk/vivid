import { App } from "@vivid/types";
import { PaypalLogo } from "./logo";
import { PaypalAppSetup } from "./setup";
import { PAYPAL_APP_NAME } from "./const";

import image1 from "./images/1.png";

export const PaypalApp: App = {
  name: PAYPAL_APP_NAME,
  displayName: "Paypal",
  scope: ["payment"],
  type: "basic",
  category: ["Payments"],
  Logo: ({ className }) => <PaypalLogo className={className} />,
  SetUp: (props) => <PaypalAppSetup {...props} />,
  isFeatured: true,
  description: {
    text: `You can use your own Paypal Business account to receive payments from your customers be it a deposit or full price in advance.`,
    images: [image1.src],
  },
};
