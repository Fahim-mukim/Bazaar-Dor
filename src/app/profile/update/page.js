"use client";

import { useState } from "react";
import { useSession, updateUser } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

function ProfileUpdateForm({ user }) {
  const router = useRouter();
  const [name, setName] = useState(user?.name || "");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmed = name.trim();
    if (!trimmed) {
      const msg = "নাম ফাঁকা রাখা যাবে না";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    setSubmitting(true);

    try {
      // Better Auth updateUser API
      const res = await updateUser({
        name: trimmed,
      });

      if (res?.error) {
        const errText = res.error.message || "তথ্য আপডেট করা সম্ভব হয়নি";
        setErrorMessage(errText);
        toast.error(errText);
        setSubmitting(false);
        return;
      }

      toast.success("প্রোফাইলের তথ্য সফলভাবে আপডেট করা হয়েছে!");
      router.push("/profile");
      router.refresh();
    } catch (err) {
      const errText = err.message || "তথ্য আপডেট করতে কোনো সমস্যা হয়েছে";
      setErrorMessage(errText);
      toast.error(errText);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg sm:p-10">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-emerald-700">
          👤
        </div>
        <div>
          <h1 className="text-xl font-black text-gray-900 sm:text-2xl">
            প্রোফাইল তথ্য আপডেট
          </h1>
          <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
            আপনার অ্যাকাউন্টের নাম ও তথ্য পরিবর্তন করুন
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
          {errorMessage}
        </div>
      )}

      {/* Update Form */}
      <form onSubmit={handleUpdate} className="mt-6 space-y-5">
        <div>
          <label className="block text-xs font-bold text-gray-700 sm:text-sm">
            ইমেইল অ্যাড্রেস (পরিবর্তনযোগ্য নয়)
          </label>
          <input
            type="email"
            disabled
            value={user.email || ""}
            className="mt-1.5 w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-3.5 py-2.5 text-sm text-gray-500"
          />
        </div>

        <div>
          <label
            htmlFor="user-name-input"
            className="block text-xs font-bold text-gray-700 sm:text-sm"
          >
            আপনার পূর্ণ নাম (Name)
          </label>
          <input
            id="user-name-input"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="আপনার নাম লিখুন"
            className="mt-1.5 w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex items-center gap-3 pt-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {submitting ? "আপডেট হচ্ছে..." : "তথ্য আপডেট করুন (Update Information)"}
          </button>

          <Link
            href="/profile"
            className="rounded-xl border border-gray-300 px-4 py-3 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 sm:text-sm"
          >
            বাতিল
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function ProfileUpdatePage() {
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
    router.replace("/signin?callbackUrl=/profile/update&message=unauthorized");
    return null;
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <ProfileUpdateForm user={session.user} />
    </div>
  );
}
