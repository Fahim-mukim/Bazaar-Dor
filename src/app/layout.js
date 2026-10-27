import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Navbar from "@/component/Navbar";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata = {
  title: "বাজার দর | আজকের বাজারের দাম",
  description:
    "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের আজকের দাম, গতকালের দাম এবং বাজারভিত্তিক মূল্য তুলনা করুন।",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn"
      data-theme="light"
    >
      <body className={`${hindSiliguri.className} min-h-screen flex flex-col antialiased`}>

        <Navbar></Navbar>
        {children}

      </body>
    </html>
  );
}
