import { MongoClient } from "mongodb";
import type { MongoClientOptions } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) throw new Error("Missing MONGODB_URI");
if (!dbName) throw new Error("Missing MONGODB_DB");

const options: MongoClientOptions = {
  maxPoolSize: 10,
};

// Avoid creating multiple clients in dev/hot-reload
declare global {
  var __mongo_client__: any;
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
