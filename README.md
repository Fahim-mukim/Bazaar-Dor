# 🛒 বাজার দর (BazarDor) — নিত্যপ্রয়োজনীয় পণ্যের বাজার দর

বাজার দর (BazarDor) হলো বাংলাদেশের নিত্যপ্রয়োজনীয় দ্রব্যাদির দৈনন্দিন বাজার দর পর্যবেক্ষণ, বিশ্লেষণ ও বাজারভিত্তিক মূল্য তুলনা করার একটি আধুনিক ওয়েব অ্যাপ্লিকেশন। এখানে রাজধানী ঢাকাসহ সারাদেশের বিভিন্ন পাইকারি ও খুচরা বাজারের চাল, ডাল, তেল, সবজি, মাছ, মাংস ও মসলার সঠিক ও হালনাগাদ দর প্রদর্শন করা হয়।

---

## 🌟 মূল বৈশিষ্ট্যসমূহ (Key Features)

1. **লাইভ প্রাইজ টিকার (Live Infinite Price Ticker)**:
   - ওয়েবসাইটের শীর্ষে প্রতিটি নিত্যপণ্যের নাম, আজকের দর এবং মূল্যবৃদ্ধির/হ্রাসের শতকরা হার (▲/▼) স্বয়ংক্রিয়ভাবে স্ক্রল করে দেখানো হয়।
2. **দৈনন্দিন বাজার ট্রেন্ড বিশ্লেষণ (Market Trends Analysis)**:
   - **আজ দাম বেড়েছে ▲**: আজকের বাজারে সর্বোচ্চ মূল্যবৃদ্ধি পাওয়া শীর্ষ ৬টি পণ্য।
   - **আজ দাম কমেছে ▼**: আজকের বাজারে সর্বোচ্চ দরপতন ঘটা শীর্ষ ৬টি পণ্য।
   - **সব পণ্য**: সকল পণ্যের সুবিন্যস্ত কার্ড যেখানে বাংলায় মূল্য ও পরিবর্তন প্রদর্শিত।
3. **ক্যাটাগরি ফিল্টারিং ও সঠিক সংখ্যাভিত্তিক সর্টিং (Numeric Sorting)**:
   - চাল, ডাল, মাছ, মাংস, ডিম-দুধ ইত্যাদিতে ক্যাটাগরি অনুযায়ী ফিল্টারিং।
   - **সাজান (Sort)**: ডিফল্ট, দাম কম থেকে বেশি, এবং দাম বেশি থেকে কম (স্ট্রিং হিসেবে নয়, প্রকৃত গাণিতিক মূল্যের ভিত্তিতে সঠিক সর্টিং)।
4. **সার্ভার-সাইড সুরক্ষিত প্রোডাক্ট ডিটেইলস (Protected Product Details)**:
   - প্রতিটি পণ্যের বিস্তারিত বিবরণ ও সারাদেশের বাজারভিত্তিক দাম দেখার পাতাটি শুধুমাত্র সাইন-ইন করা ব্যবহারকারীদের জন্য সুরক্ষিত। লগইন না থাকলে সাইন-ইন পেজে রিডাইরেক্ট করা হয়।
   - সর্বনিম্ন, সর্বোচ্চ এবং সারাদেশের গড় মূল্য স্বয়ংক্রিয়ভাবে হিসাব করে প্রদর্শন।
5. **আধুনিক অথেনটিকেশন ও প্রোফাইল আপডেট (BetterAuth & Profile Management)**:
   - ইমেইল/পাসওয়ার্ডের মাধ্যমে সাইন-আপ ও সাইন-ইন।
   - গুগল ও গিটহাব সোশ্যাল লগইন সাপোর্ট।
   - প্রোফাইল তথ্য দেখার সুবিধা এবং BetterAuth-এর অফিসিয়াল `updateUser` API ব্যবহার করে নাম পরিবর্তনের ব্যবস্থা।
6. **পূর্ণাঙ্গ বাংলা ইন্টারফেস ও রেসপনসিভ ডিজাইন (Bengali Numerals & Full Responsiveness)**:
   - প্রতিটি সংখ্যা ও মূল্য বাংলা সংখ্যায় (০-৯) স্বয়ংক্রিয়ভাবে রূপান্তরিত।
   - মোবাইল, ট্যাবলেট এবং ডেস্কটপ সব ডিভাইসে ব্যবহারোপযোগী।
   - লোডিং স্কেলিটন, ইন্টারঅ্যাক্টিভ টোস্ট নোটিফিকেশন (`react-hot-toast`), এবং ইউজার-ফ্রেন্ডলি ৪০৪ (Not Found) পেজ।

---

## 🛠️ ব্যবহৃত প্রযুক্তিসমূহ (Technologies Used)

- **ফ্রন্টএন্ড ফ্রেমওয়ার্ক**: [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/)
- **স্টাইলিং**: [Tailwind CSS v4](https://tailwindcss.com/), [DaisyUI v5](https://daisyui.com/)
- **টাইপোগ্রাফি**: Google Font [Hind Siliguri](https://fonts.google.com/specimen/Hind+Siliguri)
- **অথেনটিকেশন**: [Better Auth](https://www.better-auth.com/)
- **ডাটাবেজ অ্যাডাপ্টার**: [MongoDB](https://www.mongodb.com/) (`@better-auth/mongo-adapter`)
- **নোটিফিকেশন**: [react-hot-toast](https://react-hot-toast.com/)
- **API সোর্স**: Programming Hero Official BazarDor API

---

## 🚀 লোকাল ডেভেলপমেন্ট সেটআপ (Local Development)

### ১. রিপোজিটরি ক্লোন করুন
```bash
git clone <repository-url>
cd bazar-dor
```

### ২. ডিপেন্ডেন্সি ইনস্টল করুন
```bash
npm install
```

### ৩. এনভায়রনমেন্ট ভেরিয়েবল সেটআপ (`.env.local`)
প্রজেক্টের রুট ডিরেক্টরিতে `.env.local` ফাইল তৈরি করুন এবং নিচের মানগুলো দিন:

```env
# Application Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000

# Better Auth Secret (ন্যূনতম ৩২ অক্ষরের সিক্রেট)
BETTER_AUTH_SECRET=bazardor-secret-key-assignment-development-2026-secure

# MongoDB সংযোগ স্ট্রিং (লোকাল অথবা মঙ্গোডিবি অ্যাটলাস)
MONGODB_URI=mongodb://127.0.0.1:27017/bazardor
MONGODB_DB_NAME=bazardor

# গুগল লগইন (ঐচ্ছিক)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# গিটহাব লগইন (ঐচ্ছিক)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

### ৪. OAuth কলব্যাক URL কনফিগারেশন

আপনি যদি Google বা GitHub সোশ্যাল লগইন সক্রিয় করতে চান, তবে সংশ্লিষ্ট ডেভেলপার কনসোলে নিচের কলব্যাক URL যুক্ত করুন:
- **Google Authorized Redirect URI**:
  `http://localhost:3000/api/auth/callback/google`
  (প্রোডাকশনে: `https://your-domain.vercel.app/api/auth/callback/google`)
- **GitHub Authorization Callback URL**:
  `http://localhost:3000/api/auth/callback/github`
  (প্রোডাকশনে: `https://your-domain.vercel.app/api/auth/callback/github`)

### ৫. ডেভেলপমেন্ট সার্ভার চালু করুন
```bash
npm run dev
```
ব্রাউজারে [http://localhost:3000](http://localhost:3000) ওপেন করুন।

---

## 📦 প্রোডাকশন বিল্ড ও ডিপ্লয়মেন্ট (Build & Deployment)

প্রোডাকশন বিল্ড তৈরি করতে:
```bash
npm run build
```

প্রোডাকশন সার্ভার চালু করতে:
```bash
npm run start
```

### Vercel-এ ডিপ্লয়মেন্ট:
1. রিপোজিটরিটি GitHub-এ পুশ করুন।
2. [Vercel](https://vercel.com/)-এ ইমপোর্ট করুন।
3. Environment Variables সেকশনে `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (`https://your-app.vercel.app`) যোগ করে Deploy বাটনে ক্লিক করুন।

---

## 📄 লাইসেন্স
এই প্রজেক্টটি শিক্ষামূলক উদ্দেশ্যে Programming Hero Assignment 07-এর জন্য তৈরি।
