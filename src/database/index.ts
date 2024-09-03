import { MongoClient } from "mongodb";
import { env } from "process";
import { cache } from "react";

export const getDbClient = cache(() => new MongoClient(env["MONGODB_URI"]!));

export const getDbConnection = async () => {
  return getDbClient().db();
};
