import {
  CUSTOMER_EMAIL_NOTIFICATION_APP_NAME,
  CUSTOMER_TEXT_MESSAGE_NOTIFICATION_APP_NAME,
  FILE_SYSTEM_ASSETS_STORAGE_APP_NAME,
  LOG_CLEANUP_APP_NAME,
  REMINDERS_APP_NAME,
} from "./apps";

export const PreinstalledApps: Record<string, string> = {
  [FILE_SYSTEM_ASSETS_STORAGE_APP_NAME]: FILE_SYSTEM_ASSETS_STORAGE_APP_NAME,
  [CUSTOMER_EMAIL_NOTIFICATION_APP_NAME]: CUSTOMER_EMAIL_NOTIFICATION_APP_NAME,
  [CUSTOMER_TEXT_MESSAGE_NOTIFICATION_APP_NAME]:
    CUSTOMER_TEXT_MESSAGE_NOTIFICATION_APP_NAME,
  [REMINDERS_APP_NAME]: REMINDERS_APP_NAME,
  [LOG_CLEANUP_APP_NAME]: LOG_CLEANUP_APP_NAME,
};
