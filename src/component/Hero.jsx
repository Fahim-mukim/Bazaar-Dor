import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-b from-white to-emerald-50/30 py-10 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Text Content */}
          <div className="text-center lg:col-span-7 lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 shadow-xs sm:text-sm">
              <span>🌾</span>
              <span>দৈনন্দিন বাজার বিশ্লেষণের বিশ্বস্ত প্ল্যাটফর্ম</span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-5xl">
              আজকের বাজার দর জানুন, <br className="hidden sm:inline" />
              <span className="text-emerald-600">সঠিক মূল্যে</span> পণ্য কিনুন
            </h1>

            <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
              প্রতিদিনের আপডেটেড বাজার দর, মূল্যের হ্রাস-বৃদ্ধি এবং রাজধানীসহ সারাদেশের বাজারভিত্তিক মূল্য বিশ্লেষণ এক নজরে যাচাই করুন।
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <a
                href="#সব-পণ্য"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-base font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 hover:shadow-lg active:scale-95"
              >
                <span>সব পণ্য দেখুন</span>
                <span className="text-lg">↓</span>
              </a>

              <a
                href="#আজ-দাম-বেড়েছে"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3.5 text-base font-semibold text-gray-700 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <span>বাজার পরিবর্তন</span>
                <span>📈</span>
              </a>
            </div>
          </div>

          {/* Right Banner Image */}
          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-none">
              <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white p-3 shadow-xl shadow-emerald-500/10">
                <Image
                  src="/assets/bazar-hero.png"
                  alt="বাজার দর হিরো ব্যানার"
                  width={600}
                  height={450}
                  priority
                  className="h-auto w-full rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
