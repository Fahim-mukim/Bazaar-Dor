export default function CategoryLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Category Header Skeleton */}
      <div className="mb-8 flex items-center gap-4 border-b border-gray-200 pb-6">
        <div className="h-16 w-16 animate-pulse rounded-2xl bg-gray-200 sm:h-20 sm:w-20"></div>
        <div className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
          <div className="h-8 w-44 animate-pulse rounded-lg bg-gray-200"></div>
          <div className="h-3 w-60 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>

      {/* Sort Bar Skeleton */}
      <div className="mb-6 flex h-14 w-full animate-pulse rounded-2xl bg-gray-100"></div>

      {/* Product Cards Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5"
          >
            <div className="space-y-3">
              <div className="h-14 w-14 animate-pulse rounded-2xl bg-gray-200"></div>
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
              <div className="h-6 w-36 animate-pulse rounded bg-gray-200"></div>
            </div>
            <div className="mt-6 border-t border-gray-100 pt-3">
              <div className="h-5 w-20 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
