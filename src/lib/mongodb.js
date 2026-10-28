import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;

if (!uri) {
  throw new Error(
    "MONGODB_URI is missing. Please configure it in your .env file."
  );
}

if (!dbName) {
  throw new Error(
    "MONGODB_DB_NAME is missing. Please set it to bazardor in your .env file."
  );
}

const options = {
  maxPoolSize: 10,
  minPoolSize: 1,
  serverSelectionTimeoutMS: 8000,
  connectTimeoutMS: 8000,
};

// Reuse the same client during development hot reloads.
const globalForMongo = globalThis;

export const client =
  globalForMongo._bazarDorMongoClient ||
  new MongoClient(uri, options);

if (process.env.NODE_ENV !== "production") {
  globalForMongo._bazarDorMongoClient = client;
}

// Always select the explicitly configured database.
export const db = client.db(dbName);

let clientPromise =
  globalForMongo._bazarDorMongoClientPromise || null;

/**
 * Return the shared, connected MongoClient.
 * A failed connection promise is cleared so a later request can retry.
 */
export async function getMongoClient() {
  if (!clientPromise) {
    clientPromise = client.connect().catch((error) => {
      clientPromise = null;

      if (process.env.NODE_ENV !== "production") {
        globalForMongo._bazarDorMongoClientPromise = null;
      }

      throw error;
    });

    if (process.env.NODE_ENV !== "production") {
      globalForMongo._bazarDorMongoClientPromise = clientPromise;
    }
  }

  await clientPromise;

  return client;
}

/**
 * Return a database handle after ensuring the connection is established.
 */
export async function getDatabase(customDbName) {
  const connectedClient = await getMongoClient();
  const targetDbName = customDbName || dbName;

  return connectedClient.db(targetDbName);
}

/**
 * Test MongoDB connectivity without exposing connection credentials.
 */
export async function testMongoConnection() {
  if (
    /<db_password>|<password>|<username>|YOUR_USERNAME|YOUR_PASSWORD/i.test(
      uri
    )
  ) {
    return {
      ok: false,
      errorName: "ConfigurationError",
      message: "Replace the placeholder in MONGODB_URI.",
    };
  }

  try {
    const database = await getDatabase();
    await database.command({ ping: 1 });

    return {
      ok: true,
      message: "MongoDB connection and ping successful.",
      databaseName: dbName,
    };
  } catch (error) {
    const isAuthenticationError =
      error.code === 8000 ||
      /bad auth|authentication failed/i.test(error.message || "");

    return {
      ok: false,
      errorName: error.name || "MongoError",
      errorCode: error.code ?? null,
      message: isAuthenticationError
        ? "Atlas rejected authentication. Check the Database Access username and password."
        : "MongoDB connection failed. Check the URI, network access, and cluster status.",
    };
  }
}

export default getMongoClient;