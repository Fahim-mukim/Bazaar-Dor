import Link from "next/link";
import { formatChange, formatPrice, formatUnit } from "@/lib/utils";

export default function ProductCard({ product }) {
  if (!product) return null;

  const change = formatChange(product.change);
  const formattedPrice = formatPrice(product.today);
  const formattedUnit = formatUnit(product.unit);
  const productLink = `/product/${product.slug || product.id}`;

  return (
    <Link
      href={productLink}
      className="group relative flex flex-col justify-between rounded-2xl border border-gray-200/90 bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/5"
    >
      <div>
        {/* Top: Emoji Icon & Change Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-3xl shadow-inner transition group-hover:bg-emerald-50 sm:h-16 sm:w-16 sm:text-4xl">
            <span>{product.image || product.categoryIcon || "🛒"}</span>
          </div>

          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${change.colorClass}`}
          >
            {change.text}
          </span>
        </div>

        {/* Product Details */}
        <div className="mt-4">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700">
            <span>{product.categoryIcon || "🏷️"}</span>
            <span>{product.categoryNameBn || "নিত্যপণ্য"}</span>
          </div>

          <h3 className="mt-1 line-clamp-1 text-lg font-bold text-gray-900 group-hover:text-emerald-700 sm:text-xl">
            {product.nameBn}
          </h3>

          <p className="mt-0.5 text-xs font-medium text-gray-500 sm:text-sm">
            {formattedUnit}
          </p>
        </div>
      </div>

      {/* Bottom: Price row */}
      <div className="mt-5 border-t border-gray-100 pt-3">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-medium text-gray-500">আজকের দাম</span>
          <span className="text-base font-extrabold text-emerald-700 sm:text-lg">
            {formattedPrice}
          </span>
        </div>
      </div>
    </Link>
  );
}
