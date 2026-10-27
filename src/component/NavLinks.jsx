import { getAllCategories } from "@/lib/api";
import CategoryLinksClient from "./CategoryLinksClient";
import { Suspense } from "react";

export default async function NavLinks() {
  let categories = [];
  try {
    categories = await getAllCategories();
  } catch (err) {
    console.error("Failed to fetch categories for NavLinks:", err);
  }

  return (
    <Suspense
      fallback={
        <nav className="border-b border-gray-200 bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto sm:gap-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-28 shrink-0 animate-pulse rounded-full bg-gray-100"
                ></div>
              ))}
            </div>
          </div>
        </nav>
      }
    >
      <CategoryLinksClient categories={categories} />
    </Suspense>
  );
}
