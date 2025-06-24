import { App } from "@vivid/types";
import { SMTP_APP_NAME } from "./const";
import { SmtpLogo } from "./logo";
import { SmtpAppSetup } from "./setup";

export const SmtpApp: App = {
  name: SMTP_APP_NAME,
  displayName: "smtp.displayName",
  scope: ["mail-send"],
  type: "complex",
  category: ["categories.communications"],
  Logo: ({ className }) => <SmtpLogo className={className} />,
  isFeatured: true,
  dontAllowMultiple: true,
  description: {
    text: "smtp.description",
  },
  menuItems: [
    {
      href: "settings/smtp",
      parent: "settings",
      id: "settings-smtp",
      label: "navigation.smtp",
      icon: <SmtpLogo />,
      Page: (props) => <SmtpAppSetup {...props} />,
    },
  ],
  settingsHref: "settings/smtp",
};
