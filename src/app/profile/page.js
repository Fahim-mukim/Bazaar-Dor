"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex min-h-[450px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!session?.user) {
    router.replace("/signin?callbackUrl=/profile&message=unauthorized");
    return null;
  }

  const user = session.user;
  const initial = user.name ? user.name.trim().charAt(0).toUpperCase() : "👤";

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("সফলভাবে সাইন আউট হয়েছে");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট ব্যর্থ হয়েছে");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
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
              <p className="mt-1 font-bold text-gray-900">
                {user.name || "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
              <span className="text-xs font-medium text-gray-500">ইমেইল</span>
              <p className="mt-1 font-bold text-gray-900 truncate">
                {user.email || "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
              <span className="text-xs font-medium text-gray-500">অ্যাকাউন্ট স্ট্যাটাস</span>
              <p className="mt-1 font-bold text-emerald-700">
                সক্রিয় (Active)
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
              <span className="text-xs font-medium text-gray-500">ইউজার আইডি</span>
              <p className="mt-1 font-mono text-xs text-gray-700 truncate">
                {user.id || "—"}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
            <Link
              href="/"
              className="text-xs font-semibold text-gray-600 hover:text-emerald-700 sm:text-sm"
            >
              ← হোম পেজে ফিরে যান
            </Link>

            <button
              onClick={handleSignOut}
              className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100 sm:text-sm"
            >
              সাইন আউট
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
