import { BookingConfiguration } from "./booking";
import { CommunicationsConfiguration } from "./communications";
import { GeneralConfiguration } from "./general";
import { ScriptsConfiguration } from "./scripts";
import { SocialConfiguration } from "./social";
import {
  FooterConfiguration,
  HeaderConfiguration,
  StylingConfiguration,
} from "./styling";

export * from "./booking";
export * from "./communications";
export * from "./general";
export * from "./resources";
export * from "./scripts";
export * from "./social";
export * from "./styling";

export type Configuration = {
  general: GeneralConfiguration;
  social: SocialConfiguration;
  header: HeaderConfiguration;
  footer: FooterConfiguration;
  booking: BookingConfiguration;
  communications: CommunicationsConfiguration;
  scripts: ScriptsConfiguration;
  styling: StylingConfiguration;
};
