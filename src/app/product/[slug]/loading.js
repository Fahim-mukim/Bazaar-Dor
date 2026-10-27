export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb skeleton */}
      <div className="mb-6 h-4 w-48 animate-pulse rounded bg-gray-200"></div>

      {/* Header card skeleton */}
      <div className="mb-8 flex flex-col justify-between gap-6 rounded-3xl border border-gray-200 bg-white p-8 md:flex-row">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 animate-pulse rounded-3xl bg-gray-200"></div>
          <div className="space-y-3">
            <div className="h-6 w-32 animate-pulse rounded-full bg-gray-200"></div>
            <div className="h-10 w-56 animate-pulse rounded-xl bg-gray-200"></div>
            <div className="h-4 w-40 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>
        <div className="h-28 w-48 animate-pulse rounded-2xl bg-gray-100"></div>
      </div>

      {/* Price Stats skeleton */}
      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="h-32 animate-pulse rounded-2xl bg-gray-200"></div>
        <div className="h-32 animate-pulse rounded-2xl bg-gray-200"></div>
        <div className="h-32 animate-pulse rounded-2xl bg-gray-200"></div>
      </div>

      {/* Table skeleton */}
      <div className="h-64 animate-pulse rounded-3xl bg-gray-100"></div>
    </div>
  );
}
