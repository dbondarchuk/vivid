import { IConnectedApp, IConnectedAppProps } from "@vivid/types";
import { CALDAV_APP_NAME } from "../apps/caldav/caldav.const";
import CaldavConnectedApp from "../apps/caldav/caldav.service";
import { CUSTOMER_EMAIL_NOTIFICATION_APP_NAME } from "../apps/customerEmailNotification/customerEmailNotification.const";
import CustomerEmailNotificationConnectedApp from "../apps/customerEmailNotification/customerEmailNotification.service";
import { CUSTOMER_TEXT_MESSAGE_NOTIFICATION_APP_NAME } from "../apps/customerTextMessageNotification/customerTextMessageNotification.const";
import CustomerTextMessageNotificationConnectedApp from "../apps/customerTextMessageNotification/customerTextMessageNotification.service";
import { EMAIL_NOTIFICATION_APP_NAME } from "../apps/emailNotification/emailNotification.const";
import { EmailNotificationConnectedApp } from "../apps/emailNotification/emailNotification.service";
import { FILE_SYSTEM_ASSETS_STORAGE_APP_NAME } from "../apps/fileSystemAssetsStorage/fileSystemAssetsStorage.const";
import FileSystemAssetsStorageConnectedApp from "../apps/fileSystemAssetsStorage/fileSystemAssetsStorage.service";
import { ICS_APP_NAME } from "../apps/ics/ics.const";
import IcsConnectedApp from "../apps/ics/ics.service";
import { LOG_CLEANUP_APP_NAME } from "../apps/logCleanup/logCleanup.const";
import LogCleanupConnectedApp from "../apps/logCleanup/logCleanup.service";
import { OUTLOOK_APP_NAME } from "../apps/outlook/outlook.const";
import OutlookConnectedApp from "../apps/outlook/outlook.service";
import { REMINDERS_APP_NAME } from "../apps/reminders/reminders.const";
import RemindersConnectedApp from "../apps/reminders/reminders.service";
import { SMTP_APP_NAME } from "../apps/smtp/smtp.const";
import SmtpConnectedApp from "../apps/smtp/smtp.service";
import { TEXTBELT_APP_NAME } from "../apps/textBelt/textBelt.const";
import TextBeltConnectedApp from "../apps/textBelt/textBelt.service";
import { TEXT_MESSAGE_NOTIFICATION_APP_NAME } from "../apps/textMessageNotification/textMessageNotification.const";
import { TextMessageNotificationConnectedApp } from "../apps/textMessageNotification/textMessageNotification.service";

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
  [FILE_SYSTEM_ASSETS_STORAGE_APP_NAME]: (props) =>
    new FileSystemAssetsStorageConnectedApp(props),
};
