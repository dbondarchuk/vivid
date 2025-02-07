import { App } from "@vivid/types";
import { CaldavApp } from "./apps/caldav/caldav.app";
import { CALDAV_APP_NAME } from "./apps/caldav/caldav.const";
import { CustomerEmailNotificationApp } from "./apps/customerEmailNotification/customerEmailNotification.app";
import { CUSTOMER_EMAIL_NOTIFICATION_APP_NAME } from "./apps/customerEmailNotification/customerEmailNotification.const";
import { CustomerTextMessageNotificationApp } from "./apps/customerTextMessageNotification/customerTextMessageNotification.app";
import { CUSTOMER_TEXT_MESSAGE_NOTIFICATION_APP_NAME } from "./apps/customerTextMessageNotification/customerTextMessageNotification.const";
import { EmailNotificationApp } from "./apps/emailNotification/emailNotification.app";
import { EMAIL_NOTIFICATION_APP_NAME } from "./apps/emailNotification/emailNotification.const";
import { FileSystemAssetsStorageApp } from "./apps/fileSystemAssetsStorage/fileSystemAssetsStorage.app";
import { FILE_SYSTEM_ASSETS_STORAGE_APP_NAME } from "./apps/fileSystemAssetsStorage/fileSystemAssetsStorage.const";
import { IcsApp } from "./apps/ics/ics.app";
import { ICS_APP_NAME } from "./apps/ics/ics.const";
import { LogCleanupApp } from "./apps/logCleanup/logCleanup.app";
import { LOG_CLEANUP_APP_NAME } from "./apps/logCleanup/logCleanup.const";
import { OutlookApp } from "./apps/outlook/outlook.app";
import { OUTLOOK_APP_NAME } from "./apps/outlook/outlook.const";
import { RemindersApp } from "./apps/reminders/reminders.app";
import { REMINDERS_APP_NAME } from "./apps/reminders/reminders.const";
import { SmtpApp } from "./apps/smtp/smtp.app";
import { SMTP_APP_NAME } from "./apps/smtp/smtp.const";
import { TextBeltApp } from "./apps/textBelt/textBelt.app";
import { TEXTBELT_APP_NAME } from "./apps/textBelt/textBelt.const";
import { TextMessageNotificationApp } from "./apps/textMessageNotification/textMessageNotification.app";
import { TEXT_MESSAGE_NOTIFICATION_APP_NAME } from "./apps/textMessageNotification/textMessageNotification.const";

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
  [FILE_SYSTEM_ASSETS_STORAGE_APP_NAME]: FileSystemAssetsStorageApp,
};

export { CALDAV_APP_NAME } from "./apps/caldav/caldav.const";
export { CUSTOMER_EMAIL_NOTIFICATION_APP_NAME } from "./apps/customerEmailNotification/customerEmailNotification.const";
export { CUSTOMER_TEXT_MESSAGE_NOTIFICATION_APP_NAME } from "./apps/customerTextMessageNotification/customerTextMessageNotification.const";
export { EMAIL_NOTIFICATION_APP_NAME } from "./apps/emailNotification/emailNotification.const";
export { FILE_SYSTEM_ASSETS_STORAGE_APP_NAME } from "./apps/fileSystemAssetsStorage/fileSystemAssetsStorage.const";
export { ICS_APP_NAME } from "./apps/ics/ics.const";
export { LOG_CLEANUP_APP_NAME } from "./apps/logCleanup/logCleanup.const";
export { OUTLOOK_APP_NAME } from "./apps/outlook/outlook.const";
export { REMINDERS_APP_NAME } from "./apps/reminders/reminders.const";
export { SMTP_APP_NAME } from "./apps/smtp/smtp.const";
export { TEXTBELT_APP_NAME } from "./apps/textBelt/textBelt.const";
export { TEXT_MESSAGE_NOTIFICATION_APP_NAME } from "./apps/textMessageNotification/textMessageNotification.const";
