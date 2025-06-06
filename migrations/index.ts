import { mongoMigrateCli } from "mongo-migrate-ts";
import { Config } from "mongo-migrate-ts/dist/lib/config";
import config from "../migrations.json";

mongoMigrateCli({
  ...config,
  migrationsDir: __dirname,
} as Config);
