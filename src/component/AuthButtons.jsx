"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AuthButtons() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("সফলভাবে সাইন আউট সম্পন্ন হয়েছে");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট হতে সমস্যা হয়েছে");
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-16 animate-pulse rounded-lg bg-gray-200"></div>
        <div className="h-8 w-16 animate-pulse rounded-lg bg-gray-200"></div>
      </div>
    );
  }

  if (session?.user) {
    const user = session.user;
    const initial = user.name ? user.name.trim().charAt(0).toUpperCase() : "👤";

    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/profile"
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 transition hover:border-emerald-500 hover:bg-emerald-50 sm:px-3 sm:py-2"
          title="প্রোফাইল দেখুন"
        >
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || "User"}
              width={28}
              height={28}
              unoptimized
              className="h-7 w-7 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
              {initial}
            </div>
          )}
          <span className="max-w-[100px] truncate text-xs font-medium text-gray-800 sm:max-w-[140px] sm:text-sm">
            {user.name || "ব্যবহারকারী"}
          </span>
        </Link>

        <button
          onClick={handleSignOut}
          className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 sm:px-4 sm:py-2 sm:text-sm"
        >
          সাইন আউট
        </button>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
      <Link
        href="/signin"
        className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-emerald-600 hover:bg-emerald-50 sm:px-5 sm:py-2 sm:text-sm"
      >
        সাইন ইন
      </Link>

      <Link
        href="/signup"
        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 sm:px-5 sm:py-2 sm:text-sm"
      >
        সাইন আপ
      </Link>
    </div>
  );
}
