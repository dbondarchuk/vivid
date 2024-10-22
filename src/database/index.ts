import { MongoClient } from "mongodb";
import { env } from "process";

if (!env["MONGODB_URI"]) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = env["MONGODB_URI"];
const options = { appName: "vivid" };

let client: MongoClient;

if (env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
  }
  client = globalWithMongo._mongoClient;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
}

export const getDbConnection = async () => {
  await client.connect();

  return client.db();
};
