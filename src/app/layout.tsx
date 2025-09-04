import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Header from "./components/Header/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tavros",
  description: "Opis Firmy",
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
        <Header />
           {/* Promo bar */}
      <div className="grid place-items-center gap-0.5 bg-[#f6f6f6] py-1.5 text-center">
        <span className="text-[11px] text-black font-semibold tracking-widest">
          FREE UK EXPRESS DELIVERY
        </span>
        <small className="text-[11px] text-gray-700 opacity-70 tracking-widest">
          ON ORDERS OVER £125
        </small>
      </div>
        {children}
      </body>
    </html>
  );
}
