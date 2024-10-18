export const timeBeforeReminderType = "timeBefore" as const;
export const atTimeReminderType = "atTime" as const;
export const reminderTypes = [
  timeBeforeReminderType,
  atTimeReminderType,
] as const;
export type ReminderType = (typeof reminderTypes)[number];

export const emailReminderChannel = "email" as const;
export const smsReminderChannel = "sms" as const;
export const reminderChannels = [
  emailReminderChannel,
  smsReminderChannel,
] as const;
export type ReminderChannel = (typeof reminderChannels)[number];

export type TimeBeforeReminder = {
  type: typeof timeBeforeReminderType;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes: number;
};

export type AtTimeReminder = {
  type: typeof atTimeReminderType;
  weeks?: number;
  days: number;
  time: {
    hour: number;
    minute: number;
  };
};

export type EmailChannelReminder = {
  channel: typeof emailReminderChannel;
  body: string;
  subject: string;
};

export type SmsChannelReminder = {
  channel: typeof smsReminderChannel;
  body: string;
};

export type Reminder = (TimeBeforeReminder | AtTimeReminder) &
  (EmailChannelReminder | SmsChannelReminder) & {
    id: string;
    name: string;
  };
