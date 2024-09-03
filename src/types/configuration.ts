import { ButtonSize, ButtonVariant } from "@/components/ui/button";
import { LinkSize, LinkVariant } from "@/components/ui/link";
import { FieldsWithId, WithLabelFieldData } from "./booking";
import {
  AppointmentAddon,
  AppointmentOption,
} from "./booking/appointmentOption";
import { AvailablePeriod } from "./booking/timeSlot";
import { AppointmentStatus } from "./database";

export type Id = {
  id: string;
};

export type WithId<T> = T & Id;

export type BaseMenuItem = {
  url: string;
  label: string;
};

export type IconMenuItem = BaseMenuItem & {
  icon: string;
  type: "icon";
};

type BaseLinkMenuItem = BaseMenuItem & {
  prefixIcon?: string;
  suffixIcon?: string;
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
  templates: Record<AppointmentStatus, EmailTemplateConfiguration>;
  event: EventConfiguration;
};

export type HeaderConfiguration = {
  menu: MenuItem[];
};

export type FooterConfiguration = {
  links: MenuItem[];
};

export type BookingConfiguration = {
  ics: string;
  maxWeeksInFuture?: number;
  minAvailableTimeAfterSlot?: number;
  minAvailableTimeBeforeSlot?: number;
  slotStartMinuteStep?: number;
  timezone: string;
  workHours: AvailablePeriod[];
  addons?: WithId<AppointmentAddon>[];
  fields?: FieldsWithId<WithLabelFieldData>;
  options: WithId<AppointmentOption>[];
  email: EmailConfiguration;
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
  mapsUrl?: string;
  logo: string;
};

export type SocialConfiguration = {
  instagram?: string;
  facebook?: string;
};

export type Configuration = {
  general: GeneralConfiguration;
  social: SocialConfiguration;
  header: HeaderConfiguration;
  footer: FooterConfiguration;
  booking: BookingConfiguration;
  smtp: SmtpConfiguration;
};
