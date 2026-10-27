"use client";

import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignOutButton({ className = "" }) {
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

  return (
    <button
      onClick={handleSignOut}
      className={
        className ||
        "rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100 sm:text-sm"
      }
    >
      সাইন আউট
    </button>
  );
}
