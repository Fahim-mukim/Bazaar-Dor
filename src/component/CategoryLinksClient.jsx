"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CategoryLinksClient({ categories = [] }) {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto py-3 sm:gap-3">
          {/* All / Home link */}
          <Link
            href="/"
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition duration-200 sm:px-5 ${
              pathname === "/"
                ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                : "border-gray-200 bg-gray-50 text-gray-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            }`}
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-base shadow-sm ${
                pathname === "/" ? "bg-emerald-700 text-white" : "bg-white"
              }`}
            >
              🏠
            </span>
            <span>সকল পণ্য</span>
          </Link>

          {categories.map((item) => {
            const isActive = pathname === `/category/${item.slug}`;
            return (
              <Link
                key={item.slug}
                href={`/category/${item.slug}`}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition duration-200 sm:px-5 ${
                  isActive
                    ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                    : "border-gray-200 bg-gray-50 text-gray-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-base shadow-sm ${
                    isActive ? "bg-emerald-700 text-white" : "bg-white"
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.nameBn}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
