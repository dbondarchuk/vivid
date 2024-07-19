import { ButtonVariant } from "@/components/ui/button";
import { LinkVariant } from "@/components/ui/link";
import { MeetingOption } from "./meetingOption";
import { AvailablePeriod } from "./timeSlot";

export type IconMenuItem = {
  icon: string;
  url: string;
  label: string;
};

export type LinkMenuItem = {
  url: string;
  label: string;
  prefixIcon?: string;
  suffixIcon?: string;
  variant?: LinkVariant;
  size: "sm" | "md" | "lg";
};

export type ButtonMenuItem = LinkMenuItem & {
  button: true;
  variant?: ButtonVariant;
};

export type MenuItem = IconMenuItem | LinkMenuItem | ButtonMenuItem;

export type SmtpConfiguration = {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
};

export type EmailConfiguration = {
  to: string;
  from: string;
  subject: string;
  body: string;
};

export type EventConfiguration = {
  summary: string;
  description: string;
};

export type BookingConfiguration = {
  ics: string;
  maxWeeksInFuture?: number;
  minAvailableTimeAfterSlot?: number;
  minAvailableTimeBeforeSlot?: number;
  slotStartMinuteStep?: number;
  timeZone?: string;
  workHours: AvailablePeriod[];
  meetingOptions: MeetingOption[];
  email: EmailConfiguration;
  event: EventConfiguration;
};

export type Configuration = {
  name: string;
  title: string;
  description: string;
  keywords: string;
  phone: string;
  email: string;
  address: string;
  instagram?: string;
  facebook?: string;
  url: string;
  mapsUrl?: string;
  logo: string;
  menu: MenuItem[];
  footer: MenuItem[];
  booking: BookingConfiguration;
  smtp: SmtpConfiguration;
};
