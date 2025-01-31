import { App } from "@/types";
import { CaldavApp } from "./caldav/caldav.app";
import { CALDAV_APP_NAME } from "./caldav/caldav.const";
import { CustomerEmailNotificationApp } from "./customerEmailNotification/customerEmailNotification.app";
import { CUSTOMER_EMAIL_NOTIFICATION_APP_NAME } from "./customerEmailNotification/customerEmailNotification.const";
import { CustomerTextMessageNotificationApp } from "./customerTextMessageNotification/customerTextMessageNotification.app";
import { CUSTOMER_TEXT_MESSAGE_NOTIFICATION_APP_NAME } from "./customerTextMessageNotification/customerTextMessageNotification.const";
import { EmailNotificationApp } from "./emailNotification/emailNotification.app";
import { EMAIL_NOTIFICATION_APP_NAME } from "./emailNotification/emailNotification.const";
import { IcsApp } from "./ics/ics.app";
import { ICS_APP_NAME } from "./ics/ics.const";
import { LogCleanupApp } from "./logCleanup/logCleanup.app";
import { LOG_CLEANUP_APP_NAME } from "./logCleanup/logCleanup.const";
import { OutlookApp } from "./outlook/outlook.app";
import { OUTLOOK_APP_NAME } from "./outlook/outlook.const";
import { RemindersApp } from "./reminders/reminders.app";
import { REMINDERS_APP_NAME } from "./reminders/reminders.const";
import { SmtpApp } from "./smtp/smtp.app";
import { SMTP_APP_NAME } from "./smtp/smtp.const";
import { TextBeltApp } from "./textBelt/textBelt.app";
import { TEXTBELT_APP_NAME } from "./textBelt/textBelt.const";
import { TextMessageNotificationApp } from "./textMessageNotification/textMessageNotification.app";
import { TEXT_MESSAGE_NOTIFICATION_APP_NAME } from "./textMessageNotification/textMessageNotification.const";

export const AvailableApps: Record<string, App> = {
  [OUTLOOK_APP_NAME]: OutlookApp,
  [ICS_APP_NAME]: IcsApp,
  [CALDAV_APP_NAME]: CaldavApp,
  [SMTP_APP_NAME]: SmtpApp,
  [TEXTBELT_APP_NAME]: TextBeltApp,
  [CUSTOMER_EMAIL_NOTIFICATION_APP_NAME]: CustomerEmailNotificationApp,
  [EMAIL_NOTIFICATION_APP_NAME]: EmailNotificationApp,
  [CUSTOMER_TEXT_MESSAGE_NOTIFICATION_APP_NAME]:
    CustomerTextMessageNotificationApp,
  [TEXT_MESSAGE_NOTIFICATION_APP_NAME]: TextMessageNotificationApp,
  [REMINDERS_APP_NAME]: RemindersApp,
  [LOG_CLEANUP_APP_NAME]: LogCleanupApp,
};
