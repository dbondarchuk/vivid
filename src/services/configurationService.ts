import { getDbConnection } from "@/database";
import {
  ConfigurationKey,
  ConfigurationOption,
} from "@/types/database/configurationOption";
import { cache } from "react";

export const CONFIGURATION_COLLECTION_NAME = "configuration";

export class ConfigurationService {
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

    if (!value?.value) throw new Error(`Can't find configuration for '${key}'`);

    return value.value;
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

  public async getConfiguration<T extends ConfigurationKey>(
    key: T
  ): Promise<ConfigurationOption<T>["value"]> {
    return await this.cachedGetConfiguration(key);
  }
}
