import { CommunicationChannel } from "@vivid/types";
import { ReminderType } from "./models";

export const REMINDERS_APP_NAME = "reminders";

export const reminderChannelLabels: Record<CommunicationChannel, string> = {
  email: "Email",
  "text-message": "Text message",
};

export const reminderTypeLabels: Record<ReminderType, string> = {
  timeBefore: "Time before",
  atTime: "At time",
};
