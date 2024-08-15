import { MongoClient } from "mongodb";
import { NextRequest } from "next/server";
import { env } from "process";

const client = new MongoClient(env["MONGODB_URI"]!);

export const getDbConnection = async () => {
  return client.db();
};
