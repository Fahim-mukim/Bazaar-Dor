import { auth } from "@/lib/auth";
import ProfileUpdateForm from "@/component/ProfileUpdateForm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata = {
  title: "প্রোফাইল তথ্য আপডেট | বাজার দর",
  description: "আপনার অ্যাকাউন্টের নাম ও তথ্য পরিবর্তন করুন",
};

async function ProfileUpdateContent() {
  const headerList = await headers();
  let session = null;
  try {
    session = await auth.api.getSession({ headers: headerList });
  } catch (err) {
    console.error("[ProfileUpdate Server] Session check error:", err.name);
  }

  if (!session?.user) {
    redirect("/signin?callbackUrl=/profile/update&message=unauthorized");
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <ProfileUpdateForm user={session.user} />
    </div>
  );
}

export default function ProfileUpdatePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[450px] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
        </div>
      }
    >
      <ProfileUpdateContent />
    </Suspense>
  );
}
