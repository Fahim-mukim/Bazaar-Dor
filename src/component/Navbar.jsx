import Image from "next/image";
import Link from "next/link";
import NavLinks from "./NavLinks";
import AuthButtons from "./AuthButtons";
import BengaliDate from "./BengaliDate";
import Marque from "./Marque";
import { Suspense } from "react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs">
      <div className="border-b border-gray-200 bg-white">
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          {/* Left: Logo and Date */}
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3 transition hover:opacity-95 sm:gap-4"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-14 sm:w-14">
              <Image
                src="/assets/logo-icon.png"
                alt="বাজার দর লোগো"
                width={40}
                height={40}
                className="h-8 w-8 object-contain sm:h-10 sm:w-10"
              />
            </div>

            <div className="min-w-0">
              <h1 className="text-lg font-bold leading-tight text-gray-900 sm:text-2xl">
                🛒 বাজার দর
              </h1>
              <BengaliDate />
            </div>
          </Link>

          {/* Right: Auth Buttons */}
          <Suspense
            fallback={
              <div className="flex items-center gap-2">
                <div className="h-8 w-16 animate-pulse rounded-lg bg-gray-100"></div>
              </div>
            }
          >
            <AuthButtons />
          </Suspense>
        </nav>
      </div>

      {/* Row 2: Category Nav Links */}
      <Suspense fallback={<div className="h-14 border-b border-gray-200 bg-white" />}>
        <NavLinks />
      </Suspense>

      {/* Row 3: Live Price Ticker Marquee */}
      <Suspense fallback={<div className="h-9 border-b border-emerald-100 bg-emerald-50/70" />}>
        <Marque />
      </Suspense>
    </header>
  );
}
