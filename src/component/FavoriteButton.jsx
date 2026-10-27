"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function FavoriteButton({ product, initialFavorited = false }) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (!product?.id) return;
    setLoading(true);

    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          toast.error("বুকমার্ক করতে অনুগ্রহ করে সাইন ইন করুন");
          return;
        }
        throw new Error("Failed to toggle favorite");
      }

      const data = await res.json();
      setFavorited(data.favorited);
      if (data.message) {
        toast.success(data.message);
      }
    } catch {
      toast.error("পছন্দের তালিকা আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      aria-label={favorited ? "পছন্দের তালিকা থেকে সরান" : "পছন্দের তালিকায় রাখুন"}
      className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition shadow-xs ${
        favorited
          ? "border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100"
          : "border-gray-300 bg-white text-gray-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
      }`}
    >
      <span className={favorited ? "text-rose-500 text-sm" : "text-gray-400 text-sm"}>
        {favorited ? "❤️" : "🤍"}
      </span>
      <span>{favorited ? "সংরক্ষিত" : "সংরক্ষণ করুন"}</span>
    </button>
  );
}
