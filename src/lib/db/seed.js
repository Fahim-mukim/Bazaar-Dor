import nextEnv from "@next/env";
const { loadEnvConfig } = nextEnv;
import { MongoClient } from "mongodb";

loadEnvConfig(process.cwd());

const PRIMARY_API = "https://openapi.programming-hero.com/api/bazardor";
const FALLBACK_API = "https://api.abcz.workers.dev/api/bazardor";

async function fetchFromApi(endpoint) {
  try {
    const res = await fetch(`${PRIMARY_API}${endpoint}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn(`[Seed] Primary API failed for ${endpoint}, trying fallback...`);
  }

  try {
    const res = await fetch(`${FALLBACK_API}${endpoint}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.error(`[Seed] Fallback API also failed for ${endpoint}:`, err.message);
  }

  return [];
}

export async function seedDatabase() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "bazardor";

  if (!uri) {
    console.error("[Seed] Error: MONGODB_URI environment variable is not set.");
    process.exit(1);
  }

  console.log("[Seed] Connecting to MongoDB database...");
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });

  try {
    await client.connect();
    const db = client.db(dbName);
    console.log("[Seed] Connected successfully. Setting up collections and indexes...");

    // 1. Ensure indexes
    const categoriesCol = db.collection("categories");
    await categoriesCol.createIndex({ slug: 1 }, { unique: true });

    const productsCol = db.collection("products");
    await productsCol.createIndex({ id: 1 }, { unique: true });
    await productsCol.createIndex({ slug: 1 }, { unique: true });
    await productsCol.createIndex({ category: 1 });

    const favoritesCol = db.collection("user_favorites");
    await favoritesCol.createIndex({ userId: 1, productId: 1 }, { unique: true });
    await favoritesCol.createIndex({ userId: 1 });

    // 2. Fetch & Upsert Categories
    console.log("[Seed] Fetching categories from API...");
    const rawCategories = await fetchFromApi("/categories");
    let catCount = 0;

    for (const cat of rawCategories) {
      if (!cat.slug) continue;
      await categoriesCol.updateOne(
        { slug: cat.slug },
        {
          $set: {
            id: cat.id || cat.slug,
            slug: cat.slug,
            nameBn: cat.nameBn,
            icon: cat.icon || "🏷️",
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
      catCount++;
    }
    console.log(`[Seed] Successfully upserted ${catCount} categories.`);

    // 3. Fetch & Upsert Products
    console.log("[Seed] Fetching products from API...");
    const rawProducts = await fetchFromApi("/products");
    let prodCount = 0;

    for (const prod of rawProducts) {
      if (!prod.id) continue;
      await productsCol.updateOne(
        { id: prod.id },
        {
          $set: {
            id: prod.id,
            slug: prod.slug,
            nameBn: prod.nameBn,
            category: prod.category,
            categoryNameBn: prod.categoryNameBn || "",
            categoryIcon: prod.categoryIcon || "",
            unit: prod.unit || "kg",
            image: prod.image || "🛒",
            today: prod.today,
            yesterday: prod.yesterday,
            lastWeek: prod.lastWeek,
            lastMonth: prod.lastMonth,
            change: prod.change || { dir: "flat", pct: 0 },
            markets: Array.isArray(prod.markets) ? prod.markets : [],
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
      prodCount++;
    }
    console.log(`[Seed] Successfully upserted ${prodCount} products.`);
    console.log("[Seed] Database migration and seeding completed successfully!");
  } catch (err) {
    console.error("[Seed] Migration failed with error:", err.name, err.code || "");
    if (err.name === "MongoServerSelectionError") {
      console.error(
        "[Seed] Notice: MongoDB Atlas rejected the connection (IP not whitelisted). Please ensure your current public IP is added to your MongoDB Atlas Network Access whitelist."
      );
    }
    throw err;
  } finally {
    await client.close();
  }
}

// Execute directly if run as a script
if (process.argv[1]?.endsWith("seed.js")) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
