import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-lg sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-4xl shadow-inner sm:h-24 sm:w-24 sm:text-5xl">
          🔍
        </div>

        <span className="mt-6 inline-block rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-black tracking-wider text-emerald-800">
          ৪০৪ | পৃষ্ঠা খুঁজে পাওয়া যায়নি
        </span>

        <h1 className="mt-4 text-2xl font-black text-gray-900 sm:text-3xl">
          পৃষ্ঠাটি বিদ্যমান নেই
        </h1>

        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          দুঃখিত, আপনি যে পাতাটিতে প্রবেশের চেষ্টা করছেন তা খুঁজে পাওয়া যায়নি অথবা লিংকটি পরিবর্তিত হয়েছে।
        </p>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-95"
          >
            <span>← হোম পেজে ফিরে যান</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
