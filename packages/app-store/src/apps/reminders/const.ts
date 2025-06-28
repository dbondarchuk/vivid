import { AppsKeys } from "@vivid/i18n";
import { CommunicationChannel } from "@vivid/types";
import { ReminderType } from "./models";

export const REMINDERS_APP_NAME = "reminders";

export const reminderChannelLabels: Record<CommunicationChannel, AppsKeys> = {
  email: "reminders.channels.email",
  "text-message": "reminders.channels.text-message",
};

export const reminderTypeLabels: Record<ReminderType, AppsKeys> = {
  timeBefore: "reminders.triggers.timeBefore",
  atTime: "reminders.triggers.atTime",
};
