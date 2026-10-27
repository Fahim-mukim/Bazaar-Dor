import { auth } from "@/lib/auth";
import { getUserFavorites } from "@/lib/db/favorites";
import { formatPrice, formatUnit } from "@/lib/utils";
import SignOutButton from "@/component/SignOutButton";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata = {
  title: "প্রোফাইল | বাজার দর",
  description: "আপনার বাজার দর প্রোফাইল এবং পছন্দের সংরক্ষিত পণ্যসমূহ",
};

async function ProfileContent() {
  const headerList = await headers();
  let session = null;
  try {
    session = await auth.api.getSession({ headers: headerList });
  } catch (err) {
    console.error("[Profile Server] Session check error:", err.name);
  }

  if (!session?.user) {
    redirect("/signin?callbackUrl=/profile&message=unauthorized");
  }

  const user = session.user;
  const initial = user.name ? user.name.trim().charAt(0).toUpperCase() : "👤";

  // Fetch user-specific persistent data (saved favorites) from MongoDB
  let favorites = [];
  try {
    favorites = await getUserFavorites(user.id);
  } catch (err) {
    console.warn("[Profile Server] Could not fetch user favorites:", err.name);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Profile Card */}
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        {/* Cover strip */}
        <div className="h-28 bg-gradient-to-r from-emerald-600 to-teal-500 sm:h-36"></div>

        <div className="relative px-6 pb-8 sm:px-10">
          {/* Avatar */}
          <div className="-mt-14 mb-4 flex items-end justify-between sm:-mt-16">
            <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-emerald-700 text-3xl font-black text-white shadow-md sm:h-28 sm:w-28 sm:text-4xl">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  width={112}
                  height={112}
                  unoptimized
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                <span>{initial}</span>
              )}
            </div>

            {/* C3: Update Information button that takes user to another route */}
            <Link
              href="/profile/update"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 sm:px-5 sm:text-sm"
            >
              <span>তথ্য পরিবর্তন করুন</span>
              <span>✏️</span>
            </Link>
          </div>

          {/* User Details */}
          <div>
            <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
              {user.name || "ব্যবহারকারী"}
            </h1>
            <p className="mt-0.5 text-sm font-medium text-gray-500">
              {user.email}
            </p>
          </div>

          {/* Information Section */}
          <div className="mt-8 grid grid-cols-1 gap-4 border-t border-gray-100 pt-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
              <span className="text-xs font-medium text-gray-500">নাম</span>
              <p className="mt-1 font-bold text-gray-900">{user.name || "—"}</p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
              <span className="text-xs font-medium text-gray-500">ইমেইল</span>
              <p className="mt-1 truncate font-bold text-gray-900">{user.email || "—"}</p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
              <span className="text-xs font-medium text-gray-500">অ্যাকাউন্ট স্ট্যাটাস</span>
              <p className="mt-1 font-bold text-emerald-700">সক্রিয় (Active)</p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
              <span className="text-xs font-medium text-gray-500">ইউজার আইডি</span>
              <p className="mt-1 truncate font-mono text-xs text-gray-700">{user.id || "—"}</p>
            </div>
          </div>

          {/* User-Specific Persistent Data: Bookmarked / Favorite Products */}
          <div className="mt-10 border-t border-gray-100 pt-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">❤️</span>
                <h2 className="text-lg font-bold text-gray-900">
                  আপনার পছন্দের সংরক্ষিত পণ্যসমূহ
                </h2>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                মোট {favorites.length} টি
              </span>
            </div>

            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {favorites.map((fav) => (
                  <Link
                    key={fav.productId}
                    href={`/product/${fav.productSlug || fav.productId}`}
                    className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50/50 p-3.5 transition hover:border-emerald-300 hover:bg-emerald-50/30"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-xs">
                      {fav.image || fav.categoryIcon || "🛒"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-gray-900">
                        {fav.productNameBn}
                      </p>
                      <p className="text-xs text-emerald-700 font-semibold">
                        {formatPrice(fav.todayPrice)} / {formatUnit(fav.unit).replace("প্রতি ", "")}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-6 text-center">
                <p className="text-xs text-gray-500 sm:text-sm">
                  আপনি এখনো কোনো পণ্য পছন্দের তালিকায় সংরক্ষণ করেননি। যেকোনো পণ্যের বিস্তারিত পাতায় গিয়ে সংরক্ষণ করতে পারেন।
                </p>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
            <Link
              href="/"
              className="text-xs font-semibold text-gray-600 hover:text-emerald-700 sm:text-sm"
            >
              ← হোম পেজে ফিরে যান
            </Link>

            {/* Client Component for Interactive Sign Out */}
            <SignOutButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[450px] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
