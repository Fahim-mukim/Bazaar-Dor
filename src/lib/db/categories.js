import { getDatabase } from "@/lib/mongodb";

/**
 * Fetch all categories from MongoDB
 */
export async function getDBCategories() {
  try {
    const db = await getDatabase();
    const categories = await db
      .collection("categories")
      .find({})
      .sort({ nameBn: 1 })
      .toArray();

    return categories.map(({ _id, ...rest }) => rest);
  } catch (err) {
    console.error("[DB Categories] Error fetching categories:", err.name, err.message);
    throw err;
  }
}

/**
 * Fetch single category by slug or id from MongoDB
 */
export async function getDBCategoryBySlug(slug) {
  if (!slug) return null;
  try {
    const db = await getDatabase();
    const category = await db.collection("categories").findOne({
      $or: [{ slug: String(slug) }, { id: String(slug) }],
    });

    if (!category) return null;
    const { _id, ...rest } = category;
    return rest;
  } catch (err) {
    console.error("[DB Categories] Error fetching category by slug:", err.name, err.message);
    throw err;
  }
}
