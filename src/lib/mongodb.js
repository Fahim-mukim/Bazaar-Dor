import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bazardor";
const dbName = process.env.MONGODB_DB_NAME || "bazardor";

const options = {
  maxPoolSize: 10,
  minPoolSize: 1,
  serverSelectionTimeoutMS: 6000,
  connectTimeoutMS: 8000,
};

let client;
let clientPromise;

/**
 * Returns the connected MongoClient instance with lazy initialization
 */
export async function getMongoClient() {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    return await global._mongoClientPromise;
  }

  if (!clientPromise) {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
  return await clientPromise;
}

/**
 * Returns the primary database instance
 */
export async function getDatabase(customDbName) {
  const connectedClient = await getMongoClient();
  return connectedClient.db(customDbName || dbName);
}

/**
 * Safe connection tester that verifies connectivity without leaking credentials
 */
export async function testMongoConnection() {
  if (uri.includes("<db_password>") || uri.includes("<password>")) {
    return {
      ok: false,
      errorName: "ConfigurationError",
      message:
        "MONGODB_URI still contains '<db_password>'. Please replace it with your real MongoDB Atlas user password in .env.",
    };
  }

  try {
    const db = await getDatabase();
    await db.command({ ping: 1 });
    return { ok: true, message: "Connected successfully" };
  } catch (err) {
    return {
      ok: false,
      errorName: err.name,
      errorCode: err.code,
      message: err.message ? err.message.replace(/\/\/.*@/, "//***@") : "Unknown connection error",
    };
  }
}

export default getMongoClient;
