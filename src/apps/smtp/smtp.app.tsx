import { App } from "@/types";
import { SMTP_APP_NAME } from "./smtp.const";
import { SmtpLogo } from "./smtp.logo";
import { SmtpAppSetup } from "./smtp.setup";

export const SmtpApp: App = {
  name: SMTP_APP_NAME,
  displayName: "SMTP",
  scope: ["mail-send"],
  type: "basic",
  Logo: ({ className }) => <SmtpLogo className={className} />,
  SetUp: (props) => <SmtpAppSetup {...props} />,
};
