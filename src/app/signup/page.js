"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signUp, signIn, useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const { data: session, isPending: isSessionLoading } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (session?.user) {
      router.replace(callbackUrl);
    }
  }, [session, router, callbackUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name || !email || !password) {
      const msg = "সকল প্রয়োজনীয় তথ্য পূরণ করুন";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (password.length < 6) {
      const msg = "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);

    try {
      const res = await signUp.email({
        name,
        email,
        password,
      });

      if (res.error) {
        const errText = res.error.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";
        setErrorMessage(errText);
        toast.error(errText);
        setLoading(false);
        return;
      }

      toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! অনুগ্রহ করে সাইন ইন করুন।");
      router.push(`/signin${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`);
    } catch (err) {
      const errText = err.message || "রেজিস্ট্রেশন প্রক্রিয়ায় সমস্যা দেখা দিয়েছে";
      setErrorMessage(errText);
      toast.error(errText);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      await signIn.social({
        provider,
        callbackURL: callbackUrl,
      });
    } catch (err) {
      toast.error(`${provider} দিয়ে সাইন ইন করতে সমস্যা হয়েছে`);
    }
  };

  if (isSessionLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
            📝
          </div>
          <h1 className="mt-4 text-2xl font-black text-gray-900 sm:text-3xl">
            নতুন অ্যাকাউন্ট তৈরি
          </h1>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            আজকের বাজার দরে যুক্ত হতে রেজিস্ট্রেশন সম্পন্ন করুন
          </p>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-center text-xs font-medium text-rose-700">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 sm:text-sm">
              আপনার পূর্ণ নাম
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="যেমন: মোঃ করিম"
              className="mt-1.5 w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 sm:text-sm">
              ইমেইল অ্যাড্রেস
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="mt-1.5 w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 sm:text-sm">
              পাসওয়ার্ড
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
              className="mt-1.5 w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "সাইন আপ করুন"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200"></div>
          <span className="text-xs text-gray-400">অথবা সোস্যাল লগইন</span>
          <div className="h-px flex-1 bg-gray-200"></div>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 hover:border-gray-400 sm:text-sm"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            Google
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin("github")}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 hover:border-gray-400 sm:text-sm"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            GitHub
          </button>
        </div>

        {/* Switch to Login */}
        <div className="mt-8 text-center text-xs text-gray-600 sm:text-sm">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
          <Link
            href={`/signin${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
            className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            এখানে সাইন ইন করুন
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
        </div>
      }
    >
      <SignUpForm />
    </Suspense>
  );
}
