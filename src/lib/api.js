/**
 * BazarDor Data Access Layer
 * Primary Source of Truth: MongoDB (Persistent Application Database)
 * Fallback: Programming Hero API (Used for initial import and disaster recovery)
 */

import { getDBProducts, getDBProductsByCategory, getDBProductByIdOrSlug } from "@/lib/db/products";
import { getDBCategories, getDBCategoryBySlug } from "@/lib/db/categories";

const PRIMARY_API = "https://openapi.programming-hero.com/api/bazardor";
const FALLBACK_API = "https://api.abcz.workers.dev/api/bazardor";

async function fetchFromExternalApi(endpoint) {
  try {
    const res = await fetch(`${PRIMARY_API}${endpoint}`, { next: { revalidate: 60 } });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn(`[External API] Primary failed for ${endpoint}:`, err.message);
  }

  try {
    const fallbackRes = await fetch(`${FALLBACK_API}${endpoint}`, { next: { revalidate: 60 } });
    if (fallbackRes.ok) return await fallbackRes.json();
  } catch (fallbackErr) {
    console.error(`[External API] Fallback failed for ${endpoint}:`, fallbackErr.message);
  }

  return null;
}

/**
 * Fetch all categories — Uses MongoDB as the primary source of truth
 */
export async function getAllCategories() {
  try {
    const dbCats = await getDBCategories();
    if (Array.isArray(dbCats) && dbCats.length > 0) {
      return dbCats;
    }
  } catch (err) {
    console.warn("[Data Access] MongoDB categories read failed, using external fallback:", err.name);
  }

  const external = await fetchFromExternalApi("/categories");
  return Array.isArray(external) ? external : [];
}

/**
 * Fetch single category by slug — Uses MongoDB
 */
export async function getCategoryBySlug(slug) {
  if (!slug) return null;
  try {
    const dbCat = await getDBCategoryBySlug(slug);
    if (dbCat) return dbCat;
  } catch (err) {
    console.warn("[Data Access] MongoDB category read failed for slug:", slug, err.name);
  }

  const external = await fetchFromExternalApi(`/categories/${slug}`);
  if (external && !external.error && external.slug) return external;

  const all = await getAllCategories();
  return all.find((c) => c.slug === slug || c.id === slug) || null;
}

/**
 * Fetch all products — Uses MongoDB as the primary source of truth
 */
export async function getAllProducts() {
  try {
    const dbProducts = await getDBProducts();
    if (Array.isArray(dbProducts) && dbProducts.length > 0) {
      return dbProducts;
    }
  } catch (err) {
    console.warn("[Data Access] MongoDB products read failed, using external fallback:", err.name);
  }

  const external = await fetchFromExternalApi("/products");
  return Array.isArray(external) ? external : [];
}

/**
 * Fetch products filtered by category — Uses MongoDB
 */
export async function getProductsByCategory(categorySlug) {
  if (!categorySlug) return [];
  try {
    const dbProducts = await getDBProductsByCategory(categorySlug);
    if (Array.isArray(dbProducts) && dbProducts.length > 0) {
      return dbProducts;
    }
  } catch (err) {
    console.warn("[Data Access] MongoDB category products read failed:", err.name);
  }

  const external = await fetchFromExternalApi(`/products?category=${categorySlug}`);
  if (Array.isArray(external) && external.length > 0) return external;

  const all = await getAllProducts();
  return all.filter((p) => p.category === categorySlug);
}

/**
 * Fetch single product by id or slug — Uses MongoDB
 */
export async function getProductByIdOrSlug(idOrSlug) {
  if (!idOrSlug) return null;
  try {
    const dbProduct = await getDBProductByIdOrSlug(idOrSlug);
    if (dbProduct) return dbProduct;
  } catch (err) {
    console.warn("[Data Access] MongoDB product read failed for id/slug:", idOrSlug, err.name);
  }

  const isNumeric = /^\d+$/.test(String(idOrSlug));
  if (isNumeric) {
    const direct = await fetchFromExternalApi(`/products/${idOrSlug}`);
    if (direct && !direct.error && direct.id) return direct;
  }

  const all = await getAllProducts();
  return (
    all.find(
      (p) => String(p.id) === String(idOrSlug) || p.slug === String(idOrSlug)
    ) || null
  );
}
