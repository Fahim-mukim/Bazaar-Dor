import { auth } from "@/lib/auth";
import { getProductByIdOrSlug } from "@/lib/api";
import { isProductFavorited } from "@/lib/db/favorites";
import { formatChange, formatPrice, formatUnit, toBengaliNumber } from "@/lib/utils";
import FavoriteButton from "@/component/FavoriteButton";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductByIdOrSlug(slug);
  if (!product) {
    return {
      title: "পণ্য পাওয়া যায়নি | বাজার দর",
    };
  }
  return {
    title: `${product.nameBn} আজকের বাজার দর | বাজার দর`,
    description: `আজকের বাজারে ${product.nameBn}-এর দাম ${formatPrice(product.today)}। বিভিন্ন বাজারের দামের তুলনা ও পরিসংখ্যান।`,
  };
}

async function ProductDetailContent({ slug }) {
  // 1. Server-side Authentication Protection
  const headerList = await headers();
  let session = null;
  try {
    session = await auth.api.getSession({ headers: headerList });
  } catch (err) {
    console.error("Auth session check error on product page:", err.name);
  }

  if (!session?.user) {
    const returnUrl = encodeURIComponent(`/product/${slug}`);
    redirect(`/signin?callbackUrl=${returnUrl}&message=unauthorized`);
  }

  // 2. Fetch Product Data (MongoDB primary source of truth)
  const product = await getProductByIdOrSlug(slug);

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-4xl text-rose-600">
            ❌
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl">
            পণ্যটি পাওয়া যায়নি
          </h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            দুঃখিত, আপনি যে পণ্যটির বিবরণ খুঁজছেন তা বর্তমানে ডাটাবেজে নেই অথবা লিংকটি ভুল।
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

  // 3. Check User's Favorite Status from MongoDB
  let isFav = false;
  try {
    isFav = await isProductFavorited(session.user.id, product.id);
  } catch (err) {
    console.warn("Could not check favorite status:", err.name);
  }

  // Calculate Price Statistics
  const markets = Array.isArray(product.markets) ? product.markets : [];
  const minValues = markets.map((m) => m.min).filter((v) => typeof v === "number");
  const maxValues = markets.map((m) => m.max).filter((v) => typeof v === "number");

  const overallMin = minValues.length > 0 ? Math.min(...minValues) : product.today;
  const overallMax = maxValues.length > 0 ? Math.max(...maxValues) : product.today;

  const midPoints = markets
    .map((m) => (m.min + m.max) / 2)
    .filter((v) => !isNaN(v));
  const overallAvg =
    midPoints.length > 0
      ? Math.round(midPoints.reduce((a, b) => a + b, 0) / midPoints.length)
      : product.today;

  const change = formatChange(product.change);
  const formattedUnit = formatUnit(product.unit);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
        <Link href="/" className="hover:text-emerald-700">
          হোম
        </Link>
        <span>/</span>
        <Link
          href={`/category/${product.category}`}
          className="hover:text-emerald-700"
        >
          {product.categoryNameBn || "ক্যাটাগরি"}
        </Link>
        <span>/</span>
        <span className="font-semibold text-gray-900">{product.nameBn}</span>
      </nav>

      {/* Top — Summary Header Card */}
      <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-emerald-50 text-5xl shadow-inner sm:h-24 sm:w-24 sm:text-6xl">
              <span>{product.image || product.categoryIcon || "🛒"}</span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  {product.categoryIcon || "🏷️"} {product.categoryNameBn || "নিত্যপণ্য"}
                </span>
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${change.colorClass}`}
                >
                  {change.text} (গতকালের তুলনায়)
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-black text-gray-900 sm:text-4xl">
                  {product.nameBn}
                </h1>
                {/* User-specific Persistent Favorite Button */}
                <FavoriteButton product={product} initialFavorited={isFav} />
              </div>

              <p className="mt-1 text-sm text-gray-500 sm:text-base">
                একক: <span className="font-semibold text-gray-800">{formattedUnit}</span> • আজকের বাজার দর বিশ্লেষণ
              </p>
            </div>
          </div>

          {/* Today's Average Price Badge */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 text-center md:min-w-[200px]">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              আজকের গড় দাম
            </span>
            <div className="mt-1 text-3xl font-black text-emerald-700 sm:text-4xl">
              {formatPrice(product.today)}
            </div>
            <p className="mt-0.5 text-xs text-gray-500">{formattedUnit}</p>
          </div>
        </div>
      </div>

      {/* Price Summary Cards: Min, Max, Average */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
        {/* Minimum Price */}
        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              সর্বনিম্ন দাম
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-base">
              📉
            </span>
          </div>
          <p className="mt-3 text-2xl font-black text-gray-900 sm:text-3xl">
            {formatPrice(overallMin)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            দেশের সবচেয়ে কম মূল্যের বাজার দর ({formattedUnit})
          </p>
        </div>

        {/* Average Price */}
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              সারাদেশের গড় দাম
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-base">
              ⚖️
            </span>
          </div>
          <p className="mt-3 text-2xl font-black text-emerald-700 sm:text-3xl">
            {formatPrice(overallAvg)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            সকল বাজারের গড় হিসাব অনুযায়ী ({formattedUnit})
          </p>
        </div>

        {/* Maximum Price */}
        <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
              সর্বোচ্চ দাম
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-base">
              📈
            </span>
          </div>
          <p className="mt-3 text-2xl font-black text-gray-900 sm:text-3xl">
            {formatPrice(overallMax)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            দেশের সবচেয়ে বেশি মূল্যের বাজার দর ({formattedUnit})
          </p>
        </div>
      </div>

      {/* Historical Comparison */}
      {(product.yesterday || product.lastWeek || product.lastMonth) && (
        <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            ঐতিহাসিক মূল্য তুলনা
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl bg-gray-50 p-4 text-center">
              <span className="text-xs text-gray-500">আজ</span>
              <p className="mt-1 font-bold text-emerald-700">
                {formatPrice(product.today)}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 text-center">
              <span className="text-xs text-gray-500">গতকাল</span>
              <p className="mt-1 font-bold text-gray-800">
                {formatPrice(product.yesterday)}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 text-center">
              <span className="text-xs text-gray-500">গত সপ্তাহ</span>
              <p className="mt-1 font-bold text-gray-800">
                {formatPrice(product.lastWeek)}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 text-center">
              <span className="text-xs text-gray-500">গত মাস</span>
              <p className="mt-1 font-bold text-gray-800">
                {formatPrice(product.lastMonth)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* বাজারভিত্তিক আজকের দাম (Market-wise Today's Prices) */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
        <div className="mb-6 flex flex-col items-start justify-between gap-2 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-black text-gray-900 sm:text-2xl">
              বাজারভিত্তিক আজকের দাম
            </h2>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              দেশের প্রধান প্রধান পাইকারি ও খুচরা বাজারের দামের তারতম্য ({formattedUnit})
            </p>
          </div>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
            মোট {toBengaliNumber(markets.length)} টি বাজার
          </span>
        </div>

        {markets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-bold text-gray-500">
                  <th className="py-3 pr-4">বাজারের নাম</th>
                  <th className="py-3 px-4">বিভাগ</th>
                  <th className="py-3 px-4 text-right">সর্বনিম্ন দাম</th>
                  <th className="py-3 px-4 text-right">সর্বোচ্চ দাম</th>
                  <th className="py-3 pl-4 text-right">গড় দাম</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {markets.map((m, idx) => {
                  const marketAvg = Math.round((m.min + m.max) / 2);
                  return (
                    <tr
                      key={idx}
                      className="transition hover:bg-emerald-50/50"
                    >
                      <td className="py-3.5 pr-4 font-bold text-gray-900">
                        {m.market}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                          {m.division}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-blue-700">
                        {formatPrice(m.min)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-rose-700">
                        {formatPrice(m.max)}
                      </td>
                      <td className="py-3.5 pl-4 text-right font-bold text-emerald-700">
                        {formatPrice(marketAvg)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
            এই পণ্যের জন্য বর্তমানে কোনো আলাদা বাজারভিত্তিক ডাটা পাওয়া যায়নি।
          </p>
        )}
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
      <div className="h-4 w-48 animate-pulse rounded bg-gray-200"></div>
      <div className="h-44 animate-pulse rounded-3xl bg-gray-100"></div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="h-32 animate-pulse rounded-2xl bg-gray-100"></div>
        <div className="h-32 animate-pulse rounded-2xl bg-gray-100"></div>
        <div className="h-32 animate-pulse rounded-2xl bg-gray-100"></div>
      </div>
    </div>
  );
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailContent slug={slug} />
    </Suspense>
  );
}
