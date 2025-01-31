import { IConnectedApp, IConnectedAppProps } from "@/types";
import { CALDAV_APP_NAME } from "./caldav/caldav.const";
import { CaldavConnectedApp } from "./caldav/caldav.service";
import { CUSTOMER_EMAIL_NOTIFICATION_APP_NAME } from "./customerEmailNotification/customerEmailNotification.const";
import { CustomerEmailNotificationConnectedApp } from "./customerEmailNotification/customerEmailNotification.service";
import { CUSTOMER_TEXT_MESSAGE_NOTIFICATION_APP_NAME } from "./customerTextMessageNotification/customerTextMessageNotification.const";
import { CustomerTextMessageNotificationConnectedApp } from "./customerTextMessageNotification/customerTextMessageNotification.service";
import { EMAIL_NOTIFICATION_APP_NAME } from "./emailNotification/emailNotification.const";
import { EmailNotificationConnectedApp } from "./emailNotification/emailNotification.service";
import { ICS_APP_NAME } from "./ics/ics.const";
import { IcsConnectedApp } from "./ics/ics.service";
import { LOG_CLEANUP_APP_NAME } from "./logCleanup/logCleanup.const";
import { LogCleanupConnectedApp } from "./logCleanup/logCleanup.service";
import { OUTLOOK_APP_NAME } from "./outlook/outlook.const";
import { OutlookConnectedApp } from "./outlook/outlook.service";
import { REMINDERS_APP_NAME } from "./reminders/reminders.const";
import { RemindersConnectedApp } from "./reminders/reminders.service";
import { SMTP_APP_NAME } from "./smtp/smtp.const";
import { SmtpConnectedApp } from "./smtp/smtp.service";
import { TEXTBELT_APP_NAME } from "./textBelt/textBelt.const";
import { TextBeltConnectedApp } from "./textBelt/textBelt.service";
import { TEXT_MESSAGE_NOTIFICATION_APP_NAME } from "./textMessageNotification/textMessageNotification.const";
import { TextMessageNotificationConnectedApp } from "./textMessageNotification/textMessageNotification.service";

export const AvailableAppServices: Record<
  string,
  (props: IConnectedAppProps) => IConnectedApp
> = {
  [OUTLOOK_APP_NAME]: (props) => new OutlookConnectedApp(props),
  [ICS_APP_NAME]: (props) => new IcsConnectedApp(props),
  [CALDAV_APP_NAME]: (props) => new CaldavConnectedApp(props),
  [SMTP_APP_NAME]: (props) => new SmtpConnectedApp(props),
  [TEXTBELT_APP_NAME]: (props) => new TextBeltConnectedApp(props),
  [CUSTOMER_EMAIL_NOTIFICATION_APP_NAME]: (props) =>
    new CustomerEmailNotificationConnectedApp(props),
  [EMAIL_NOTIFICATION_APP_NAME]: (props) =>
    new EmailNotificationConnectedApp(props),
  [CUSTOMER_TEXT_MESSAGE_NOTIFICATION_APP_NAME]: (props) =>
    new CustomerTextMessageNotificationConnectedApp(props),
  [TEXT_MESSAGE_NOTIFICATION_APP_NAME]: (props) =>
    new TextMessageNotificationConnectedApp(props),
  [REMINDERS_APP_NAME]: (props) => new RemindersConnectedApp(props),
  [LOG_CLEANUP_APP_NAME]: (props) => new LogCleanupConnectedApp(props),
};
