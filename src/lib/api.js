/**
 * BazarDor API client
 * Interacts with the official Programming Hero BazarDor API
 * Includes fallback endpoints for maximum uptime.
 */

const PRIMARY_API = "https://openapi.programming-hero.com/api/bazardor";
const FALLBACK_API = "https://api.abcz.workers.dev/api/bazardor";

async function fetchWithFallback(endpoint, options = {}) {
  const fetchOptions = {
    next: { revalidate: 60 },
    ...options,
  };

  try {
    const res = await fetch(`${PRIMARY_API}${endpoint}`, fetchOptions);
    if (res.ok) {
      return await res.json();
    }
    console.warn(`Primary API failed for ${endpoint} with status ${res.status}, trying fallback...`);
  } catch (err) {
    console.warn(`Primary API network error for ${endpoint}:`, err.message);
  }

  // Fallback attempt
  try {
    const fallbackRes = await fetch(`${FALLBACK_API}${endpoint}`, fetchOptions);
    if (fallbackRes.ok) {
      return await fallbackRes.json();
    }
  } catch (fallbackErr) {
    console.error(`Fallback API network error for ${endpoint}:`, fallbackErr.message);
  }

  return null;
}

/**
 * Fetch all categories
 */
export async function getAllCategories() {
  const data = await fetchWithFallback("/categories");
  return Array.isArray(data) ? data : [];
}

/**
 * Fetch a single category by slug
 */
export async function getCategoryBySlug(slug) {
  if (!slug) return null;
  const data = await fetchWithFallback(`/categories/${slug}`);
  if (data && !data.error && data.slug) {
    return data;
  }
  // If single endpoint 404s, search from all categories
  const allCategories = await getAllCategories();
  return allCategories.find((c) => c.slug === slug || c.id === slug) || null;
}

/**
 * Fetch all products
 */
export async function getAllProducts() {
  const data = await fetchWithFallback("/products");
  return Array.isArray(data) ? data : [];
}

/**
 * Fetch products filtered by category slug
 */
export async function getProductsByCategory(categorySlug) {
  if (!categorySlug) return [];
  const data = await fetchWithFallback(`/products?category=${categorySlug}`);
  if (Array.isArray(data) && data.length > 0) {
    return data;
  }
  // Fallback: fetch all and filter in memory
  const all = await getAllProducts();
  return all.filter((p) => p.category === categorySlug);
}

/**
 * Fetch a single product by numeric id or slug
 */
export async function getProductByIdOrSlug(idOrSlug) {
  if (!idOrSlug) return null;

  // If it's a numeric id, try direct endpoint first
  const isNumeric = /^\d+$/.test(String(idOrSlug));
  if (isNumeric) {
    const direct = await fetchWithFallback(`/products/${idOrSlug}`);
    if (direct && !direct.error && direct.id) {
      return direct;
    }
  }

  // Otherwise, match against all products by slug or id
  const all = await getAllProducts();
  const found = all.find(
    (p) => String(p.id) === String(idOrSlug) || p.slug === String(idOrSlug)
  );

  return found || null;
}
