import { getAllProducts } from "@/lib/api";
import { formatChange, formatPrice, formatUnit } from "@/lib/utils";
import Link from "next/link";

export default async function Marque() {

  let products = [];
  try {
    products = await getAllProducts();
  } catch (err) {
    console.error("Failed to load products for ticker:", err);
  }

  if (!products || products.length === 0) {
    return null;
  }

// Show up to 12 products and duplicate them for seamless looping
const tickerProducts = products.slice(0, 12);
const tickerItems = [...tickerProducts, ...tickerProducts];

  return (
    <div
      aria-label="বাজার দর মূল্য পরিবর্তন টিকার"
      className="relative flex overflow-x-hidden border-b border-emerald-100 bg-emerald-50/70 py-2.5 text-xs text-gray-700 sm:text-sm"
    >
      {/* Visual badge on the left */}
      <div className="z-10 flex shrink-0 items-center gap-1.5 border-r border-emerald-200 bg-emerald-600 px-3 py-0.5 text-xs font-semibold text-white shadow-sm sm:px-4">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-200 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
        </span>
        লাইভ দর
      </div>

      <div className="flex animate-marquee items-center gap-8 pl-4">
        {tickerItems.map((item, idx) => {
          const change = formatChange(item.change);
          return (
            <Link
              key={`${item.id}-${idx}`}
              href={`/product/${item.slug || item.id}`}
              className="inline-flex shrink-0 items-center gap-2 transition hover:text-emerald-700"
            >
              <span className="text-base">{item.image || item.categoryIcon || "🛒"}</span>
              <span className="font-semibold text-gray-900">{item.nameBn}</span>
              <span className="text-gray-600">
                {formatPrice(item.today)}/{formatUnit(item.unit).replace("প্রতি ", "")}
              </span>
              <span
                className={`inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-bold ${
                  change.dir === "up"
                    ? "bg-emerald-100 text-emerald-800"
                    : change.dir === "down"
                    ? "bg-rose-100 text-rose-800"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {change.text}
              </span>
              <span className="text-gray-300">•</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
