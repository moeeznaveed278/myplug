import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/layout/navbar";
import ShippingBanner from "@/components/layout/shipping-banner";
import { Toaster } from "sonner";
import Footer from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "MyPlug Canada | Exclusive Kicks & Streetwear",
    template: "%s | MyPlug Canada",
  },
  description: "Shop the latest Jordans, Yeezys, and exclusive streetwear in Canada. Fast shipping from Richmond Hill.",
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://myplug.vercel.app",
    siteName: "MyPlug Canada",
    title: "MyPlug Canada | Exclusive Kicks & Streetwear",
    description: "Shop the latest Jordans, Yeezys, and exclusive streetwear in Canada. Fast shipping from Richmond Hill.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyPlug Canada | Exclusive Kicks & Streetwear",
    description: "Shop the latest Jordans, Yeezys, and exclusive streetwear in Canada.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider>
          <ShippingBanner />
          <Navbar />
          <Toaster richColors />
          {children}
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}
