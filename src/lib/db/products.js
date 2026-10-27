import { getDatabase } from "@/lib/mongodb";

/**
 * Fetch all products from MongoDB
 */
export async function getDBProducts(query = {}) {
  try {
    const db = await getDatabase();
    const products = await db
      .collection("products")
      .find(query)
      .sort({ id: 1 })
      .toArray();

    return products.map(({ _id, ...rest }) => rest);
  } catch (err) {
    throw err;
  }
}

/**
 * Fetch products filtered by category slug from MongoDB
 */
export async function getDBProductsByCategory(categorySlug) {
  if (!categorySlug) return [];
  try {
    const db = await getDatabase();
    const products = await db
      .collection("products")
      .find({ category: String(categorySlug) })
      .sort({ id: 1 })
      .toArray();

    return products.map(({ _id, ...rest }) => rest);
  } catch (err) {
    throw err;
  }
}

/**
 * Fetch single product by id or slug from MongoDB
 */
export async function getDBProductByIdOrSlug(idOrSlug) {
  if (!idOrSlug) return null;
  try {
    const db = await getDatabase();
    const isNum = !isNaN(Number(idOrSlug));

    const filter = isNum
      ? { $or: [{ id: Number(idOrSlug) }, { slug: String(idOrSlug) }] }
      : { slug: String(idOrSlug) };

    const product = await db.collection("products").findOne(filter);
    if (!product) return null;

    const { _id, ...rest } = product;
    return rest;
  } catch (err) {
    throw err;
  }
}
