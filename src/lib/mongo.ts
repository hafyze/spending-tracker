import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";
import type { MongoClientOptions } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

// Determine environment
const ENV = process.env.NODE_ENV ?? "production";

// Pick URI & DB based on environment
const uri = ENV === "development"
  ? process.env.MONGODB_URI_DEV
  : process.env.MONGODB_URI;
const dbName = ENV === "development"
  ? process.env.MONGODB_DB_DEV
  : process.env.MONGODB_DB;

  if (!uri) throw new Error(`Missing MongoDB URI for environment: ${ENV}`);
if (!dbName) throw new Error(`Missing MongoDB DB name for environment: ${ENV}`);

const options: MongoClientOptions = {
  maxPoolSize: 10,
};

// Avoid multiple clients in dev/hot-reload
declare global {
  var __mongo_client__: MongoClient | undefined;
}

let client: MongoClient;

if (globalThis.__mongo_client__) {
  client = globalThis.__mongo_client__;
} else {
  client = new MongoClient(uri, options);
  // attach vercel pool management (safe to call even if not on Vercel)
  attachDatabasePool(client);
  globalThis.__mongo_client__ = client;
}

export const db = client.db(dbName);
