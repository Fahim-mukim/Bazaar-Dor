import { auth } from "@/lib/auth";
import SignUpForm from "@/component/SignUpForm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";


export const metadata = {
  title: "সাইন আপ | বাজার দর",
  description: "বাজার দরে নতুন অ্যাকাউন্ট তৈরি করুন",
};

export default async function SignUpPage({ searchParams }) {
  // Server-side session check
  const headerList = await headers();
  let session = null;
  try {
    session = await auth.api.getSession({ headers: headerList });
  } catch (err) {
    console.error("[SignUp Server] Session check error:", err.name);
  }

  const sp = await searchParams;
  const callbackUrl = sp?.callbackUrl || "/";

  if (session?.user) {
    redirect(callbackUrl);
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 sm:px-6">
      <Suspense
        fallback={
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
          </div>
        }
      >
        <SignUpForm />
      </Suspense>
    </div>
  );
}
