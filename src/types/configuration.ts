import { ButtonSize, ButtonVariant } from "@/components/ui/button";
import { LinkSize, LinkVariant } from "@/components/ui/link";
import { TextFont, TextSize, TextWeight } from "@/components/ui/text";
import { FieldsWithId, WithLabelFieldData } from "./booking";
import {
  AppointmentAddon,
  AppointmentOption,
} from "./booking/appointmentOption";
import { AvailablePeriod } from "./booking/timeSlot";
import { AppointmentStatus } from "./database";
import { Reminder } from "./reminders";

export type Id = {
  id: string;
};

export type WithId<T> = T & Id;

export type BaseMenuItem = {
  url: string;
  label: string;
  className?: string;
};

export type IconMenuItem = BaseMenuItem & {
  icon: string;
  type: "icon";
};

type BaseLinkMenuItem = BaseMenuItem & {
  prefixIcon?: string;
  suffixIcon?: string;
  font?: TextFont;
  fontSize?: TextSize;
  fontWeight?: TextWeight;
};

export type LinkMenuItem = BaseLinkMenuItem & {
  variant?: LinkVariant;
  size?: LinkSize;
  type: "link";
};

export type ButtonMenuItem = BaseLinkMenuItem & {
  type: "button";
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export type MenuItem = IconMenuItem | LinkMenuItem | ButtonMenuItem;

export type SmtpConfiguration = {
  host: string;
  port: number;
  secure: boolean;
  email: string;
  auth: {
    user?: string;
    pass?: string;
  };
};

export type EmailTemplateConfiguration = {
  subject: string;
  body: string;
};

export type EventConfiguration = {
  summary: string;
  description: string;
};

export type EmailConfiguration = {
  to: string;
  from: string;
  templates: Record<AppointmentStatus, EmailTemplateConfiguration> & {
    rescheduled: EmailTemplateConfiguration;
  };
  event: EventConfiguration;
};

export type SmsTemplateConfiguration = {
  body?: string;
};

export type SmsConfiguration = {
  authToken: string;
  autoReply?: string;
};

export type TextMessagesConfiguration = {
  phoneField?: string[];
  templates: Record<AppointmentStatus, SmsTemplateConfiguration> & {
    rescheduled: SmsTemplateConfiguration;
  };
};

export type HeaderConfiguration = {
  menu: MenuItem[];
};

export type FooterConfiguration =
  | {
      isCustom: false;
      links?: MenuItem[];
    }
  | {
      isCustom: true;
      content?: string;
    };

export type BookingConfiguration = {
  ics: string;
  maxWeeksInFuture?: number;
  minHoursBeforeBooking?: number;
  minAvailableTimeAfterSlot?: number;
  minAvailableTimeBeforeSlot?: number;
  slotStartMinuteStep?: number;
  timezone: string;
  workHours: AvailablePeriod[];
  addons?: WithId<AppointmentAddon>[];
  fields?: FieldsWithId<WithLabelFieldData>;
  options: WithId<AppointmentOption>[];
  email: EmailConfiguration;
  textMessages: TextMessagesConfiguration;
  reminders?: Reminder[];
};

export type GeneralConfiguration = {
  name: string;
  title: string;
  description: string;
  keywords: string;
  phone: string;
  email: string;
  address?: string;
  url: string;
  logo: string;
};

export type SocialConfiguration = {
  instagram?: string;
  facebook?: string;
};

export type InlineScript = {
  type: "inline";
  value: string;
};

export type RemoteScript = {
  type: "remote";
  url: string;
};

export type Script = InlineScript | RemoteScript;

export type ScriptsConfiguration = {
  headerScripts?: Script[];
  footerScripts?: Script[];
};

export type Configuration = {
  general: GeneralConfiguration;
  social: SocialConfiguration;
  header: HeaderConfiguration;
  footer: FooterConfiguration;
  booking: BookingConfiguration;
  smtp: SmtpConfiguration;
  sms: SmsConfiguration;
  scripts: ScriptsConfiguration;
};
