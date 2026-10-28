import nextEnv from "@next/env";
import { MongoClient } from "mongodb";

const { loadEnvConfig } = nextEnv;

// Load .env from the project root.
loadEnvConfig(process.cwd());

const PRIMARY_API =
  "https://openapi.programming-hero.com/api/bazardor";

const FALLBACK_API =
  "https://api.abcz.workers.dev/api/bazardor";

/**
 * Fetch an array from the primary API, then try the fallback API.
 * Never log a URL containing database credentials.
 */
async function fetchFromApi(endpoint) {
  const sources = [
    { name: "Primary API", url: PRIMARY_API },
    { name: "Fallback API", url: FALLBACK_API },
  ];

  for (const source of sources) {
    try {
      const response = await fetch(`${source.url}${endpoint}`);

      if (!response.ok) {
        console.warn(
          `[Seed] ${source.name} returned HTTP ${response.status} for ${endpoint}.`
        );
        continue;
      }

      const payload = await response.json();

      // Support APIs that return either an array directly
      // or wrap it inside a data property.
      const data = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : null;

      if (data) {
        return data;
      }

      console.warn(
        `[Seed] ${source.name} returned an unexpected format for ${endpoint}.`
      );
    } catch (error) {
      console.warn(
        `[Seed] ${source.name} failed for ${endpoint}:`,
        error.name || "FetchError"
      );
    }
  }

  return null;
}

export async function seedDatabase() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME;

  if (!uri) {
    throw new Error("MONGODB_URI is missing from .env.");
  }

  if (!dbName) {
    throw new Error("MONGODB_DB_NAME is missing from .env.");
  }

  if (
    /<db_password>|<password>|<username>|YOUR_USERNAME|YOUR_PASSWORD/i.test(
      uri
    )
  ) {
    throw new Error(
      "MONGODB_URI contains a placeholder. Configure the actual Atlas credentials."
    );
  }

  const client = new MongoClient(uri, {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000,
  });

  try {
    console.log("[Seed] Connecting to MongoDB...");
    await client.connect();

    const db = client.db(dbName);
    await db.command({ ping: 1 });

    console.log(
      `[Seed] Connected successfully to database "${db.databaseName}".`
    );

    // 1. Ensure indexes
    const categoriesCol = db.collection("categories");
    await categoriesCol.createIndex(
      { slug: 1 },
      { unique: true }
    );

    const productsCol = db.collection("products");
    await productsCol.createIndex(
      { id: 1 },
      { unique: true }
    );
    await productsCol.createIndex(
      { slug: 1 },
      { unique: true }
    );
    await productsCol.createIndex({ category: 1 });

    const favoritesCol = db.collection("user_favorites");
    await favoritesCol.createIndex(
      { userId: 1, productId: 1 },
      { unique: true }
    );
    await favoritesCol.createIndex({ userId: 1 });

    // 2. Fetch and upsert categories
    console.log("[Seed] Fetching categories...");
    const rawCategories = await fetchFromApi("/categories");

    if (!Array.isArray(rawCategories)) {
      throw new Error(
        "Could not fetch categories from either configured API."
      );
    }

    let categoryCount = 0;

    for (const category of rawCategories) {
      if (!category?.slug) continue;

      await categoriesCol.updateOne(
        { slug: category.slug },
        {
          $set: {
            id: category.id || category.slug,
            slug: category.slug,
            nameBn: category.nameBn,
            icon: category.icon || "🏷️",
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );

      categoryCount++;
    }

    console.log(
      `[Seed] Upserted ${categoryCount} categories.`
    );

    // 3. Fetch and upsert products
    console.log("[Seed] Fetching products...");
    const rawProducts = await fetchFromApi("/products");

    if (!Array.isArray(rawProducts)) {
      throw new Error(
        "Could not fetch products from either configured API."
      );
    }

    let productCount = 0;

    for (const product of rawProducts) {
      if (product?.id == null) continue;

      await productsCol.updateOne(
        { id: product.id },
        {
          $set: {
            id: product.id,
            slug: product.slug,
            nameBn: product.nameBn,
            category: product.category,
            categoryNameBn: product.categoryNameBn || "",
            categoryIcon: product.categoryIcon || "",
            unit: product.unit || "kg",
            image: product.image || "🛒",
            today: product.today,
            yesterday: product.yesterday,
            lastWeek: product.lastWeek,
            lastMonth: product.lastMonth,
            change: product.change || {
              dir: "flat",
              pct: 0,
            },
            markets: Array.isArray(product.markets)
              ? product.markets
              : [],
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );

      productCount++;
    }

    console.log(`[Seed] Upserted ${productCount} products.`);
    console.log("[Seed] Database seeding completed successfully.");

    return {
      ok: true,
      databaseName: dbName,
      categoryCount,
      productCount,
    };
  } catch (error) {
    console.error(
      "[Seed] Failed:",
      error.name || "Error",
      error.code ?? "N/A"
    );

    if (
      error.code === 8000 ||
      /bad auth|authentication failed/i.test(error.message || "")
    ) {
      console.error(
        "[Seed] Atlas rejected authentication. Check the Database Access username and password."
      );
    } else if (error.name === "MongoServerSelectionError") {
      console.error(
        "[Seed] Could not select a MongoDB server. Check Atlas Network Access and cluster availability."
      );
    }

    throw error;
  } finally {
    await client.close();
  }
}

// Run only when executed directly as a script.
if (process.argv[1]?.endsWith("seed.js")) {
  seedDatabase().catch(() => {
    process.exitCode = 1;
  });
}