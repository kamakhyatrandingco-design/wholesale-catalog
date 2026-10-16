import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://ktcfashion.netlify.app"),
  title: "KTC Fashion | Premium Women's & Girls' Apparel",
  description: "Explore KTC Fashion for the latest in curated ethnic wear, western silhouettes, and festive designer apparel.",
  keywords: [
    "KTC Fashion",
    "Kamakhya Trading Co",
    "Women Apparel B2B",
    "Wholesale Kurtis Surat",
    "Girls Partywear Wholesale",
    "Boutique Wholesale India",
    "Ethnic Wear Manufacturer",
    "Western Silhouettes"
  ],
  authors: [{ name: "Kamakhya Trading Co" }],
  creator: "Kamakhya Trading Co",
  publisher: "Kamakhya Trading Co",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://ktcfashion.netlify.app",
  },
  openGraph: {
    title: "KTC Fashion | Premium Women's & Girls' Apparel",
    description: "Explore KTC Fashion for the latest in curated ethnic wear, western silhouettes, and festive designer apparel.",
    url: "https://ktcfashion.netlify.app",
    siteName: "KTC Fashion",
    images: [
      {
        url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "KTC Fashion Wholesale Apparel Collection",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KTC Fashion | Premium Women's & Girls' Apparel",
    description: "Explore KTC Fashion for the latest in curated ethnic wear, western silhouettes, and festive designer apparel.",
    images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1200"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "CuCHH5CkANeImGaxE_wYeGO_j9SZpOti2ZPOHd379YA",
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://ktcfashion.netlify.app/#organization",
        "name": "KTC Fashion",
        "legalName": "Kamakhya Trading Co",
        "url": "https://ktcfashion.netlify.app",
        "logo": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=400",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-6350626582",
          "contactType": "sales",
          "areaServed": "IN",
          "availableLanguage": ["en", "hi"]
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://ktcfashion.netlify.app/#website",
        "url": "https://ktcfashion.netlify.app",
        "name": "KTC Fashion",
        "description": "Explore KTC Fashion for the latest in curated ethnic wear, western silhouettes, and festive designer apparel.",
        "publisher": {
          "@id": "https://ktcfashion.netlify.app/#organization"
        }
      }
    ]
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <head>
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://ktcfashion.netlify.app" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F9FAFB] text-gray-900 selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}
