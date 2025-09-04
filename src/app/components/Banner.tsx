"use client";

import Link from "next/link";

export default function Banner() {
  return (
    <section className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {/* Left video */}
      <div className="relative group">
        <video
          src="/videos/film1.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
        />
        {/* Overlay + CTA */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
          <Link
            href="/men/new"
            className="rounded bg-white px-6 py-2 text-sm font-bold uppercase tracking-wider text-black hover:bg-black hover:text-white transition"
          >
            Shop Mens
          </Link>
        </div>
      </div>

      {/* Right video */}
      <div className="relative group">
        <video
          src="/videos/womens.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
          <Link
            href="/women/new"
            className="rounded bg-white px-6 py-2 text-sm font-bold uppercase tracking-wider text-black hover:bg-black hover:text-white transition"
          >
            Shop Womens
          </Link>
        </div>
      </div>
    </section>
  );
}
