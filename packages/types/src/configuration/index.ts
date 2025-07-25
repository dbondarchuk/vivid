import { DefaultAppsConfiguration } from "./apps";
import { BookingConfiguration } from "./booking";
import { GeneralConfiguration } from "./general";
import { ScheduleConfiguration } from "./schedule";
import { ScriptsConfiguration } from "./scripts";
import { SocialConfiguration } from "./social";
import { StylingConfiguration } from "./styling";

export * from "./apps";
export * from "./booking";
export * from "./general";
export * from "./resources";
export * from "./schedule";
export * from "./scripts";
export * from "./social";
export * from "./styling";

export type Configuration = {
  general: GeneralConfiguration;
  social: SocialConfiguration;
  booking: BookingConfiguration;
  defaultApps: DefaultAppsConfiguration;
  scripts: ScriptsConfiguration;
  styling: StylingConfiguration;
  schedule: ScheduleConfiguration;
};

export type ConfigurationKey = keyof Configuration;

export type ConfigurationOption<T extends ConfigurationKey> = {
  key: T;
  value: Configuration[T];
};
