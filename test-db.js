import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "bazardor";

async function testConnection() {
  if (!uri) {
    console.error("FAIL: MONGODB_URI is missing from .env");
    process.exitCode = 1;
    return;
  }

  let client;

  try {
    const parsedUri = new URL(uri);

    console.log("=== MongoDB Configuration ===");
    console.log("Protocol:", parsedUri.protocol);
    console.log("Cluster host:", parsedUri.hostname);
    console.log("Username configured:", Boolean(parsedUri.username));
    console.log("Password configured:", Boolean(parsedUri.password));
    console.log("Database name:", dbName);

    if (!["mongodb:", "mongodb+srv:"].includes(parsedUri.protocol)) {
      throw new Error("Invalid MongoDB URI protocol");
    }

    if (!parsedUri.username || !parsedUri.password) {
      throw new Error("MongoDB username or password is missing");
    }

    if (
      /<username>|<password>|<db_password>|YOUR_USERNAME|YOUR_PASSWORD/i.test(uri)
    ) {
      throw new Error("MONGODB_URI contains a placeholder");
    }

    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
    });

    console.log("\nConnecting to MongoDB...");
    await client.connect();

    const db = client.db(dbName);
    await db.command({ ping: 1 });

    console.log("SUCCESS: MongoDB connected");
    console.log("SUCCESS: Database ping successful");
    console.log("Connected database:", db.databaseName);
  } catch (error) {
    console.error("\nFAIL: MongoDB connection failed");
    console.error("Error name:", error.name || "Unknown");
    console.error("Error code:", error.code ?? "N/A");

    if (/bad auth|authentication failed/i.test(error.message || "") || error.code === 8000) {
      console.error(
        "Diagnosis: Atlas rejected authentication. Check the database username, password and connection string."
      );
    } else {
      console.error("Error message:", error.message || "No message");
    }

    process.exitCode = 1;
  } finally {
    if (client) {
      await client.close().catch(() => {});
    }
  }
}

testConnection();