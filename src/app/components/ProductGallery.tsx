// components/ProductGallery.tsx
"use client";

import Image from "next/image";
import {useRef, useState} from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";

type Props = {images?: string[]; title?: string; overlay?: React.ReactNode};

export default function ProductGallery({
  images = [],
  title = "Product",
  overlay,
}: Props) {
  const safeImages = images.length ? images : ["/placeholder.png"];
  const [index, setIndex] = useState(0);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const clamp = (i: number) => Math.max(0, Math.min(safeImages.length - 1, i));
  const scrollToIndex = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const target = clamp(i);
    setIndex(target);
    el.scrollTo({left: target * el.clientWidth, behavior: "smooth"});
  };
  const next = () => scrollToIndex(index + 1);
  const prev = () => scrollToIndex(index - 1);
  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index) setIndex(clamp(i));
  };

  return (
    <div className="w-full">
      {/* ===== MOBILE: slider (<768px) ===== */}
      <div className="relative md:hidden">
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory snap-always
                     [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
                     overscroll-x-contain"
        >
          {safeImages.map((src, i) => (
            <div
              key={i}
              className="relative aspect-square w-full shrink-0 snap-start bg-gray-100"
            >
              <Image
                src={src}
                alt={`${title} ${i + 1}`}
                fill
                sizes="100vw"
                className="object-cover"
                priority={i === 0}
              />
              {overlay ? (
                <div className="absolute right-2 top-2 z-10">{overlay}</div>
              ) : null}
            </div>
          ))}
        </div>

        {safeImages.length > 1 && (
          <>
            <button
              onClick={prev}
              disabled={index === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 shadow hover:bg-white disabled:opacity-40"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              disabled={index === safeImages.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 shadow hover:bg-white disabled:opacity-40"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5">
              {safeImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToIndex(i)}
                  aria-label={`Go to image ${i + 1}`}
                  className={`h-1.5 w-1.5 rounded-full transition ${
                    i === index ? "bg-black" : "bg-black/30 hover:bg-black/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ===== TABLET: główne zdjęcie + miniatury pod spodem ===== */}
      <div className="hidden md:flex md:flex-col md:gap-4 lg:hidden">
        {/* Główne zdjęcie */}
        <div className="relative h-[70vh] w-full overflow-hidden bg-gray-100">
          <Image
            src={safeImages[index]}
            alt={`${title} ${index + 1}`}
            fill
            sizes="(min-width:768px) 100vw"
            className="object-cover"
            priority
          />
          {overlay ? (
            <div className="absolute right-3 top-3 z-10">{overlay}</div>
          ) : null}
        </div>

        {/* Miniatury — dopasowane do szerokości */}
        {safeImages.length > 1 && (
          <ul className="grid grid-cols-5 gap-2">
            {safeImages.map((src, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`relative aspect-square w-full overflow-hidden  border-2 transition
                        ${
                          i === index
                            ? "border-black"
                            : "border-transparent hover:border-black/40"
                        }`}
                  aria-label={`Show image ${i + 1}`}
                >
                  <Image
                    src={src}
                    alt={`${title} thumb ${i + 1}`}
                    fill
                    sizes="20vw"
                    className="object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ===== DESKTOP: miniatury z LEWEJ + duże foto (≥1024px) ===== */}
      <div className="hidden lg:grid lg:grid-cols-[120px_1fr] lg:gap-5">
        {/* lewa kolumna: miniatury na CAŁĄ wysokość głównego zdjęcia */}
        {safeImages.length > 1 && (
          <ul className="no-scrollbar h-[80vh] overflow-y-auto space-y-3 pr-1">
            {safeImages.map((src, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`relative w-full overflow-hidden  border-2 transition
                        ${
                          i === index
                            ? "border-black"
                            : "border-transparent hover:border-black/40"
                        }`}
                  style={{aspectRatio: "1 / 1"}} // kwadrat, dopasuje się do szerokości kolumny (120px)
                  aria-label={`Show image ${i + 1}`}
                >
                  <Image
                    src={src}
                    alt={`${title} thumb ${i + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* prawa kolumna: DUŻE zdjęcie, szerokie i wysokie */}
        <div className="relative h-[80vh] w-full overflow-hidden  bg-gray-100 shadow-sm">
          <Image
            src={safeImages[index]}
            alt={`${title} ${index + 1}`}
            fill
            sizes="(min-width:1024px) 70vw, 100vw"
            className="object-cover"
            priority
          />
          {overlay ? (
            <div className="absolute right-4 top-4 z-10">{overlay}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
