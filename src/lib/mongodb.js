import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bazardor";
const dbName = process.env.MONGODB_DB_NAME || "bazardor";

const options = {
  maxPoolSize: 10,
  minPoolSize: 1,
  serverSelectionTimeoutMS: 7000,
  connectTimeoutMS: 10000,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so the MongoClient is not
  // repeatedly instantiated across HMR (hot module replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch((err) => {
      // Clean error logging without exposing credentials
      console.error(
        "[MongoDB] Connection initialization error:",
        err.name,
        err.code || ""
      );
      throw err;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

/**
 * Returns the connected MongoClient instance
 */
export async function getMongoClient() {
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

export default clientPromise;
