import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Kamakhya Trading Co | Wholesale & B2B Women's Apparel",
  description: "Official wholesale & retail catalog of Kamakhya Trading Co. Direct manufacturing rates for Kurtis, Sarees, Lehengas, and Western Wear for boutiques and retailers.",
  keywords: "Kamakhya Trading Co, Wholesale Kurtis, Women Apparel B2B, Boutique Wholesale India, Girls Partywear Wholesale, Direct Manufacturer Apparel",
  openGraph: {
    title: "Kamakhya Trading Co | B2B Wholesale Apparel Catalog",
    description: "Direct manufacturing rates for boutiques and retailers across India. Instant WhatsApp order and bulk quotations.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F9FAFB] text-gray-900 selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}
