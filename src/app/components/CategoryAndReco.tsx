"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// ⬇️ Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

type Cat = { label: string; href: string; img: string };

const DATA = {
  MENS: {
    collections: [
      { label: "Twin Sets", href: "/collections/twin-sets", img: "/photo.webp" },
      { label: "Gymwear", href: "/collections/gymwear", img: "/photo.webp" },
      { label: "Tracksuits", href: "/collections/tracksuits", img: "/photo.webp" },
      { label: "T-Shirts", href: "/collections/mens-tshirts", img: "/photo.webp" },
    ] as Cat[],
    recommended: [
      { label: "Hoodie Pro", href: "/men/p/hoodie-pro", img: "/photo.webp" },
      { label: "Joggers Core", href: "/men/p/joggers-core", img: "/photo.webp" },
      { label: "Tank Elite", href: "/men/p/tank-elite", img: "/photo.webp" },
      { label: "Zip Jacket", href: "/men/p/zip-jacket", img: "/photo.webp" },
    ],
  },
  WOMENS: {
    collections: [
      { label: "Tops", href: "/collections/tops", img: "/photo1.webp" },
      { label: "Leggings", href: "/collections/leggings", img: "/photo1.webp" },
      { label: "Outerwear", href: "/collections/outerwear", img: "/photo1.webp" },
      { label: "T-Shirts", href: "/collections/women-tshirts", img: "/photo1.webp" },
    ] as Cat[],
    recommended: [
      { label: "Seamless Set", href: "/women/p/seamless-set", img: "/photo1.webp" },
      { label: "Crop Hoodie", href: "/women/p/crop-hoodie", img: "/photo1.webp" },
      { label: "Lite Leggings", href: "/women/p/lite-leggings", img: "/photo1.webp" },
      { label: "Windbreaker", href: "/women/p/windbreaker", img: "/photo1.webp" },
    ],
  },
};

export default function CategoryAndReco() {
  const [tab, setTab] = useState<"MENS" | "WOMENS">("MENS");
  const { collections, recommended } = DATA[tab];

  return (
    <section className="w-full">
      {/* Sticky tabs */}
      <div className="sticky top-12 z-30 border-b bg-white/90 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-6 py-3 text-lg font-semibold uppercase">
            {(["MENS", "WOMENS"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-2 transition-colors ${
                  tab === t ? "border-b-2 border-black" : "text-zinc-500 hover:text-black"
                }`}
                aria-pressed={tab === t}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Shop by Collections */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="mb-6 text-center text-sm font-extrabold tracking-[0.25em] uppercase">
          Shop by Collections
        </h2>

        <div className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((c) => (
            <Link key={c.href} href={c.href} className="group block w-full max-w-sm overflow-hidden rounded-lg">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={c.img}
                  alt={c.label}
                  fill
                  sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="pointer-events-none absolute inset-0 grid place-items-center">
                  <span className="rounded bg-black/70 px-3 py-2 text-2xl font-extrabold uppercase tracking-wider text-white">
                    {c.label}
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recommended for you — Swiper */}
      <div className="container mx-auto px-4 pb-10">
        <h2 className="mb-4 text-center text-sm font-extrabold tracking-[0.25em] uppercase">
          Recommended for you
        </h2>

        <Swiper
          modules={[Navigation, A11y]}
          navigation
          spaceBetween={12}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="w-full"
        >
          {recommended.map((p) => (
            <SwiperSlide key={p.href}>
              <Link href={p.href} className="block rounded-lg border bg-white transition hover:shadow">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-lg">
                  <Image src={p.img} alt={p.label} fill sizes="(min-width:1024px) 25vw, 224px" className="object-cover" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold">{p.label}</p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
