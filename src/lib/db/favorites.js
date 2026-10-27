import { getDatabase } from "@/lib/mongodb";

/**
 * Fetch all favorites for a specific authenticated user
 */
export async function getUserFavorites(userId) {
  if (!userId) return [];
  try {
    const db = await getDatabase();
    const favorites = await db
      .collection("user_favorites")
      .find({ userId: String(userId) })
      .sort({ createdAt: -1 })
      .toArray();

    return favorites.map(({ _id, ...rest }) => rest);
  } catch (err) {
    console.error("[DB Favorites] Error fetching favorites for user:", err.name, err.message);
    throw err;
  }
}

/**
 * Check if a product is favorited by the user
 */
export async function isProductFavorited(userId, productId) {
  if (!userId || !productId) return false;
  try {
    const db = await getDatabase();
    const found = await db.collection("user_favorites").findOne({
      userId: String(userId),
      productId: Number(productId),
    });
    return !!found;
  } catch (err) {
    console.error("[DB Favorites] Error checking favorite status:", err.name, err.message);
    return false;
  }
}

/**
 * Toggle favorite for a product (Add if not exists, remove if exists)
 */
export async function toggleProductFavorite(userId, product) {
  if (!userId || !product || !product.id) {
    throw new Error("User ID and Product details are required");
  }

  try {
    const db = await getDatabase();
    const collection = db.collection("user_favorites");

    const existing = await collection.findOne({
      userId: String(userId),
      productId: Number(product.id),
    });

    if (existing) {
      await collection.deleteOne({
        userId: String(userId),
        productId: Number(product.id),
      });
      return { favorited: false, message: "পণ্যটি বুকমার্ক তালিকা থেকে সরানো হয়েছে" };
    }

    await collection.insertOne({
      userId: String(userId),
      productId: Number(product.id),
      productSlug: product.slug,
      productNameBn: product.nameBn,
      categoryNameBn: product.categoryNameBn || "",
      categoryIcon: product.categoryIcon || "",
      image: product.image || "",
      unit: product.unit || "kg",
      todayPrice: product.today || 0,
      createdAt: new Date(),
    });

    return { favorited: true, message: "পণ্যটি পছন্দের তালিকায় সংরক্ষণ করা হয়েছে" };
  } catch (err) {
    console.error("[DB Favorites] Error toggling favorite:", err.name, err.message);
    throw err;
  }
}
