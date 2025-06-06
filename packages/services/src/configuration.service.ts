import {
  Configuration,
  ConfigurationKey,
  ConfigurationOption,
  IConfigurationService,
} from "@vivid/types";
import { getDbConnection } from "./database";

import { cache } from "react";

export const CONFIGURATION_COLLECTION_NAME = "configuration";

export class ConfigurationService implements IConfigurationService {
  public async getConfiguration<T extends ConfigurationKey>(
    key: T
  ): Promise<ConfigurationOption<T>["value"]> {
    const db = await getDbConnection();
    const configurations = db.collection<ConfigurationOption<T>>(
      CONFIGURATION_COLLECTION_NAME
    );

    const value = await configurations.findOne({
      // @ts-ignore Correct key
      key,
    });

    if (!value?.value) {
      console.error(`Can't find configuration for '${key}'`);
      return {} as ConfigurationOption<T>["value"];
    }

    return value.value;
  }

  public async getConfigurations<T extends ConfigurationKey>(
    ...keys: T[]
  ): Promise<Pick<Configuration, T>> {
    const db = await getDbConnection();
    const configurations = db.collection(CONFIGURATION_COLLECTION_NAME);

    const values: ConfigurationOption<T>[] = await configurations
      .find<ConfigurationOption<T>>({
        key: {
          $in: keys,
        },
      })
      .toArray();

    if (values.length !== keys.length) {
      console.error(
        `Can't find configuration for all keys: '${keys.join(", ")}'`
      );
    }

    return values.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.key]: cur.value,
      }),
      {} as Pick<Configuration, T>
    );
  }

  public async setConfiguration<T extends ConfigurationKey>(
    key: T,
    configuration: ConfigurationOption<T>["value"]
  ): Promise<void> {
    const db = await getDbConnection();
    const configurations = db.collection<ConfigurationOption<T>>(
      CONFIGURATION_COLLECTION_NAME
    );

    await configurations.updateOne(
      {
        // @ts-ignore Correct key
        key,
      },
      {
        $set: {
          key,
          value: configuration,
        },
      },
      {
        upsert: true,
      }
    );
  }
}

export class CachedConfigurationService extends ConfigurationService {
  private cachedGetConfiguration: ConfigurationService["getConfiguration"] =
    cache(async (option) => await super.getConfiguration(option));

  private cachedGetConfigurations: ConfigurationService["getConfigurations"] =
    cache(async (...options) => await super.getConfigurations(...options));

  public async getConfiguration<T extends ConfigurationKey>(
    key: T
  ): Promise<ConfigurationOption<T>["value"]> {
    return await this.cachedGetConfiguration(key);
  }

  public async getConfigurations<K extends ConfigurationKey>(
    ...keys: K[]
  ): Promise<Pick<Configuration, K>> {
    return await this.cachedGetConfigurations(...keys);
  }
}
