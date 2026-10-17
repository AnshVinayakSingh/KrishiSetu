import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Mukta } from "next/font/google";
const mukta = Mukta({ subsets: ["latin", "devanagari"], weight: ["400", "600", "700"] });
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "KrishiSetu | कृषिसेतु",
  description: "AI-Powered Smart Agriculture, Farmer Assistance, Crop Disease Diagnosis, Satellite Irrigation, and Direct Marketplace Platform for Indian Agriculture.",
  keywords: [
    "KrishiSetu",
    "Smart Farming India",
    "Kisan Assistant",
    "Crop Disease Detection",
    "Mandi Bhav",
    "Direct Farmer Buyer Marketplace",
    "PM-KISAN",
    "PMFBY",
    "Drip Irrigation Subsidy"
  ],
  authors: [{ name: "KrishiSetu Initiative" }],
  icons: {
    icon: "/icon.svg"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className={`${mukta.className} min-h-full flex flex-col bg-[#F8F7F0] text-[#17251D] overflow-x-hidden`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
