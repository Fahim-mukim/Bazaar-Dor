import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import { Toaster } from "react-hot-toast";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata = {
  title: "বাজার দর | আজকের নিত্যপ্রয়োজনীয় পণ্যের বাজার দর",
  description:
    "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের আজকের দাম, গতকালের দাম এবং বাজারভিত্তিক মূল্য তুলনা করুন।",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" data-theme="light">
      <body
        className={`${hindSiliguri.className} flex min-h-screen flex-col bg-gray-50/50 text-gray-900 antialiased`}
      >
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#333",
              color: "#fff",
              fontFamily: "var(--font-hind-siliguri)",
            },
          }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
