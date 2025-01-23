import { App } from "@/types";
import { CaldavApp } from "./caldav/caldav.app";
import { CALDAV_APP_NAME } from "./caldav/caldav.const";
import { IcsApp } from "./ics/ics.app";
import { ICS_APP_NAME } from "./ics/ics.const";
import { OutlookApp } from "./outlook/outlook.app";
import { OUTLOOK_APP_NAME } from "./outlook/outlook.const";
import { SmtpApp } from "./smtp/smtp.app";
import { SMTP_APP_NAME } from "./smtp/smtp.const";
import { TextBeltApp } from "./textBelt/textBelt.app";
import { TEXTBELT_APP_NAME } from "./textBelt/textBelt.const";

export const InstalledApps: Record<string, App> = {
  [OUTLOOK_APP_NAME]: OutlookApp,
  [ICS_APP_NAME]: IcsApp,
  [CALDAV_APP_NAME]: CaldavApp,
  [SMTP_APP_NAME]: SmtpApp,
  [TEXTBELT_APP_NAME]: TextBeltApp,
};
