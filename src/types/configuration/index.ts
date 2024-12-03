import { BookingConfiguration } from "./booking";
import { GeneralConfiguration } from "./general";
import { ScriptsConfiguration } from "./scripts";
import { SmsConfiguration } from "./sms";
import { SmtpConfiguration } from "./smtp";
import { SocialConfiguration } from "./social";
import {
  FooterConfiguration,
  HeaderConfiguration,
  StylingConfiguration,
} from "./styling";

export * from "./booking";
export * from "./general";
export * from "./resources";
export * from "./scripts";
export * from "./sms";
export * from "./smtp";
export * from "./social";
export * from "./styling";

export type Configuration = {
  general: GeneralConfiguration;
  social: SocialConfiguration;
  header: HeaderConfiguration;
  footer: FooterConfiguration;
  booking: BookingConfiguration;
  smtp: SmtpConfiguration;
  sms: SmsConfiguration;
  scripts: ScriptsConfiguration;
  styling: StylingConfiguration;
};
