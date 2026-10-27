"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";

export default function CategoryProductList({ initialProducts = [] }) {
  const [sortBy, setSortBy] = useState("default");

  const sortedProducts = useMemo(() => {
    const list = [...initialProducts];
    if (sortBy === "price-asc") {
      // Sort numerically ascending: lowest price first
      return list.sort((a, b) => Number(a.today || 0) - Number(b.today || 0));
    }
    if (sortBy === "price-desc") {
      // Sort numerically descending: highest price first
      return list.sort((a, b) => Number(b.today || 0) - Number(a.today || 0));
    }
    return list;
  }, [initialProducts, sortBy]);

  return (
    <div>
      {/* Sort Control Bar */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center">
        <p className="text-sm font-medium text-gray-600">
          মোট পণ্য: <span className="font-bold text-gray-900">{sortedProducts.length}</span> টি
        </p>

        {/* C1 Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-dropdown" className="text-xs font-semibold text-gray-700 sm:text-sm">
            সাজান:
          </label>
          <div className="relative">
            <select
              id="sort-dropdown"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none rounded-xl border border-gray-300 bg-white py-2 pl-3 pr-8 text-xs font-medium text-gray-800 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 sm:text-sm"
            >
              <option value="default">ডিফল্ট</option>
              <option value="price-asc">দাম: কম থেকে বেশি</option>
              <option value="price-desc">দাম: বেশি থেকে কম</option>
            </select>
            {/* Chevron Icon */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Product Cards Grid */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <span className="text-4xl">📦</span>
          <p className="mt-3 text-base font-semibold text-gray-800">
            এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য পাওয়া যায়নি
          </p>
        </div>
      )}
    </div>
  );
}
