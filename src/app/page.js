import Hero from "@/component/Hero";
import ProductCard from "@/component/ProductCard";
import { getAllProducts } from "@/lib/api";
import { Suspense } from "react";

async function HomeProductSections() {
  let products = [];
  try {
    products = await getAllProducts();
  } catch (err) {
    console.error("Failed to fetch products on HomePage:", err);
  }

  // Risers: change.dir === 'up' or change.pct > 0, sorted descending by pct
  const risers = products
    .filter((p) => p.change && (p.change.dir === "up" || p.change.pct > 0))
    .sort((a, b) => (b.change?.pct || 0) - (a.change?.pct || 0))
    .slice(0, 6);

  // Fallers: change.dir === 'down' or change.pct < 0, sorted ascending by pct
  const fallers = products
    .filter((p) => p.change && (p.change.dir === "down" || p.change.pct < 0))
    .sort((a, b) => (a.change?.pct || 0) - (b.change?.pct || 0))
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      {/* 2. Section A — আজ দাম বেড়েছে ▲ */}
      <section id="আজ-দাম-বেড়েছে" className="mb-14 scroll-mt-24 sm:mb-16">
        <div className="mb-6 flex flex-col items-start justify-between gap-2 border-b border-gray-200 pb-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-600 sm:text-sm">
              <span>▲ মূল্যবৃদ্ধি</span>
            </div>
            <h2 className="mt-1 text-2xl font-extrabold text-gray-900 sm:text-3xl">
              আজ দাম বেড়েছে ▲
            </h2>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              গতকালের তুলনায় আজকের বাজারে যেসকল পণ্যের দাম বৃদ্ধি পেয়েছে
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            শীর্ষ ৬টি পণ্য
          </span>
        </div>

        {risers.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
            {risers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-500">
            আজ কোনো পণ্যের দাম বৃদ্ধির রেকর্ড পাওয়া যায়নি।
          </p>
        )}
      </section>

      {/* 3. Section B — আজ দাম কমেছে ▼ */}
      <section id="আজ-দাম-কমেছে" className="mb-14 scroll-mt-24 sm:mb-16">
        <div className="mb-6 flex flex-col items-start justify-between gap-2 border-b border-gray-200 pb-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rose-600 sm:text-sm">
              <span>▼ মূল্যহ্রাস</span>
            </div>
            <h2 className="mt-1 text-2xl font-extrabold text-gray-900 sm:text-3xl">
              আজ দাম কমেছে ▼
            </h2>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              গতকালের তুলনায় আজকের বাজারে যেসকল পণ্যের দাম হ্রাস পেয়েছে
            </p>
          </div>
          <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
            শীর্ষ ৬টি পণ্য
          </span>
        </div>

        {fallers.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
            {fallers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-500">
            আজ কোনো পণ্যের দাম হ্রাসের রেকর্ড পাওয়া যায়নি।
          </p>
        )}
      </section>

      {/* 4. Section C — সব পণ্য */}
      <section id="সব-পণ্য" className="scroll-mt-24">
        <div className="mb-8 border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
            সব পণ্য
          </h2>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            দৈনন্দিন চাল, ডাল, মাছ, মাংস, সবজিসহ সকল নিত্যপ্রয়োজনীয় পণ্যের তালিকা
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <span className="text-4xl">🛒</span>
            <p className="mt-3 text-base font-semibold text-gray-700">
              পণ্যের তালিকা লোড করা যায়নি
            </p>
            <p className="mt-1 text-sm text-gray-500">
              দয়া করে পৃষ্ঠাটি রিফ্রেশ করুন অথবা কিছুক্ষণ পর আবার চেষ্টা করুন।
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function ProductSectionsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200"></div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl bg-gray-100"></div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200"></div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-gray-100"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div>
      {/* 1. Hero / Banner (Static Shell) */}
      <Hero />

      {/* 2. Streaming Product Sections */}
      <Suspense fallback={<ProductSectionsSkeleton />}>
        <HomeProductSections />
      </Suspense>
    </div>
  );
}
