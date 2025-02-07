import { App } from "@vivid/types";
import { SMTP_APP_NAME } from "./smtp.const";
import { SmtpLogo } from "./smtp.logo";
import { SmtpAppSetup } from "./smtp.setup";

export const SmtpApp: App = {
  name: SMTP_APP_NAME,
  displayName: "SMTP",
  scope: ["mail-send"],
  type: "complex",
  category: ["Communications"],
  Logo: ({ className }) => <SmtpLogo className={className} />,
  SetUp: (props) => <SmtpAppSetup {...props} />,
  isFeatured: true,
  dontAllowMultiple: true,
  description: {
    text: "SMTP (Simple Mail Transfer Protocol) is an internet standard for email supported by most email processing servers. Connect to SMTP to send email.",
  },
  menuItem: {
    href: "settings/smtp",
    parent: "settings",
    id: "settings-smtp",
    label: "SMTP",
    icon: <SmtpLogo />,
  },
};
