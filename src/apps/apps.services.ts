import { IConnectedApp, IConnectedAppProps } from "@/types";
import { CALDAV_APP_NAME } from "./caldav/caldav.const";
import { CaldavConnectedApp } from "./caldav/caldav.service";
import { ICS_APP_NAME } from "./ics/ics.const";
import { IcsConnectedApp } from "./ics/ics.service";
import { OUTLOOK_APP_NAME } from "./outlook/outlook.const";
import { OutlookConnectedApp } from "./outlook/outlook.service";
import { SMTP_APP_NAME } from "./smtp/smtp.const";
import { SmtpConnectedApp } from "./smtp/smtp.service";
import { TEXTBELT_APP_NAME } from "./textBelt/textBelt.const";
import { TextBeltConnectedApp } from "./textBelt/textBelt.service";

export const InstalledAppServices: Record<
  string,
  (props: IConnectedAppProps) => IConnectedApp
> = {
  [OUTLOOK_APP_NAME]: (props) => new OutlookConnectedApp(props),
  [ICS_APP_NAME]: (props) => new IcsConnectedApp(props),
  [CALDAV_APP_NAME]: (props) => new CaldavConnectedApp(props),
  [SMTP_APP_NAME]: (props) => new SmtpConnectedApp(props),
  [TEXTBELT_APP_NAME]: (props) => new TextBeltConnectedApp(props),
};
