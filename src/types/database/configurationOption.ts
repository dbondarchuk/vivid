import { Configuration } from "../configuration";

export type ConfigurationKey = keyof Configuration;

export type ConfigurationOption<T extends ConfigurationKey> = {
  key: T;
  value: Configuration[T];
};
