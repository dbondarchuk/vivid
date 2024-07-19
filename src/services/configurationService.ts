import { Configuration } from "@/models/configuration";
import { join } from "path";
import { YamlInclude } from "yaml-js-include";

export class ConfigurationService {
  public async getConfiguration(): Promise<Configuration> {
    const filePath = join(process.cwd(), "data", "config.yaml");

    const config = await new YamlInclude().loadAsync<Configuration>(filePath);
    return config;
  }
}
