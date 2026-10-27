export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero skeleton */}
      <div className="mb-12 grid grid-cols-1 gap-8 rounded-3xl bg-white p-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="h-6 w-32 animate-pulse rounded-full bg-gray-200"></div>
          <div className="h-12 w-3/4 animate-pulse rounded-xl bg-gray-200"></div>
          <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200"></div>
          <div className="h-10 w-40 animate-pulse rounded-xl bg-gray-200"></div>
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-gray-100"></div>
      </div>

      {/* Product Grid skeleton */}
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200"></div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5"
            >
              <div className="space-y-3">
                <div className="h-14 w-14 animate-pulse rounded-2xl bg-gray-200"></div>
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                <div className="h-6 w-40 animate-pulse rounded bg-gray-200"></div>
              </div>
              <div className="mt-6 border-t border-gray-100 pt-3">
                <div className="h-5 w-20 animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
