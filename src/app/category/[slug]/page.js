import CategoryProductList from "@/component/CategoryProductList";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/api";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) {
    return {
      title: "ক্যাটাগরি পাওয়া যায়নি | বাজার দর",
    };
  }
  return {
    title: `${category.nameBn} বাজার দর | আজকের পণ্যের দাম`,
    description: `আজকের ${category.nameBn}র মূল্য তালিকা এবং বাজারভিত্তিক বিবরণ।`,
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const [category, products] = await Promise.all([
    getCategoryBySlug(slug),
    getProductsByCategory(slug),
  ]);

  // If category is not found or has no valid information
  if (!category && (!products || products.length === 0)) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-4xl text-amber-600">
            🔍
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl">
            ক্যাটাগরি পাওয়া যায়নি
          </h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            দুঃখিত, আপনি যে ক্যাটাগরিটি খুঁজছেন তা আমাদের ডাটাবেজে খুঁজে পাওয়া যায়নি অথবা এটি সরানো হয়েছে।
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-emerald-700"
            >
              <span>← হোম পেজে ফিরে যান</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const categoryTitle = category?.nameBn || products[0]?.categoryNameBn || "ক্যাটাগরি";
  const categoryIcon = category?.icon || products[0]?.categoryIcon || "🛒";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Category Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-4xl shadow-inner sm:h-20 sm:w-20 sm:text-5xl">
            {categoryIcon}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <span>নিত্যপণ্যের তালিকা</span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 sm:text-4xl">
              {categoryTitle}
            </h1>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              আজকের বাজারে {categoryTitle} ক্যাটাগরির সকল পণ্যের হালনাগাদ দর
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-emerald-700 sm:text-sm"
        >
          <span>← সকল ক্যাটাগরি</span>
        </Link>
      </div>

      {/* Product List with Sorting */}
      <CategoryProductList initialProducts={products} />
    </div>
  );
}
