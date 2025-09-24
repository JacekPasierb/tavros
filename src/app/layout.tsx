import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import SocialMedia from "./sections/SocialMedia";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === "production"
      ? "https://tavros.co.uk" // <- Twoja domena
      : "http://localhost:3000"
  ),
  title: "Tavros – Online Clothing & Accessories Store",
  description: "Discover Tavros collections for men, women and kids.",
  icons: {
    icon: [
      {url: "/favicon.ico", sizes: "any"},
      {url: "/favicon-16x16.png", sizes: "16x16", type: "image/png"},
      {url: "/favicon-32x32.png", sizes: "32x32", type: "image/png"},
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Header />
          {/* Promo bar */}
          <div className="bg-[#f6f6f6]">
            <div className="container mx-auto grid place-items-center gap-0.5  py-1.5 text-center">
              <span className="text-[11px] text-black font-semibold tracking-widest">
                FREE UK EXPRESS DELIVERY
              </span>
              <small className="text-[11px] text-gray-700 opacity-70 tracking-widest">
                ON ORDERS OVER £125
              </small>
            </div>
          </div>
          {children}
          <SocialMedia />
        </Providers>
      </body>
    </html>
  );
}
