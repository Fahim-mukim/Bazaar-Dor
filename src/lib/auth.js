import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bazardor";
const dbName = process.env.MONGODB_DB_NAME || "bazardor";

if (uri.includes("<db_password>") || uri.includes("<password>")) {
  console.error(
    "⚠️ [Better Auth MongoDB Alert]: MONGODB_URI contains '<db_password>'. User signup/signin requires replacing '<db_password>' with the actual MongoDB Atlas password in .env."
  );
}

// Singleton client to avoid connection leaks across Next.js HMR reloads
const client =
  global._authMongoClient ||
  new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 1,
    serverSelectionTimeoutMS: 6000,
  });

if (process.env.NODE_ENV === "development") {
  global._authMongoClient = client;
}

const db = client.db(dbName);

const socialProviders = {};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000",
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "bazardor-production-secret-key-at-least-32-chars-long",
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders,
  user: {
    changeEmail: {
      enabled: false,
    },
  },
});

export { db, client };
