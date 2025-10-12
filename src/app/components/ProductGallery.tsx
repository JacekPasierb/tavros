// components/ProductGallery.tsx
"use client";

import Image from "next/image";
import {useEffect, useRef, useState} from "react";
import {ChevronLeft, ChevronRight, X} from "lucide-react";

type Props = {images?: string[]; title?: string; overlay?: React.ReactNode};

export default function ProductGallery({
  images = [],
  title = "Product",
  overlay,
}: Props) {
  const safeImages = images.length ? images : ["/placeholder.png"];
  const [index, setIndex] = useState(0);

  // --- Mobile slider ---
  const scrollerRef = useRef<HTMLDivElement>(null);
  const clamp = (i: number) => Math.max(0, Math.min(safeImages.length - 1, i));
  const scrollToIndex = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const target = clamp(i);
    setIndex(target);
    el.scrollTo({left: target * el.clientWidth, behavior: "smooth"});
  };

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index) setIndex(clamp(i));
  };

  // ---------- LIGHTBOX state/logic ----------
  const [open, setOpen] = useState(false);
  const openLightbox = () => setOpen(true);
  const closeLightbox = () => setOpen(false);

  // ESC + arrows when open
  useEffect(() => {
    if (!open) return;
    const clampIndex = (i: number) => Math.max(0, Math.min(safeImages.length - 1, i));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") setIndex((i) => clampIndex(i + 1));
      if (e.key === "ArrowLeft") setIndex((i) => clampIndex(i - 1));
    };
    document.addEventListener("keydown", onKey);
    // block page scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, safeImages.length]);

  // swipe on mobile inside lightbox
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      setIndex((i) => clamp(i + (dx < 0 ? 1 : -1)));
    }
    touchStartX.current = null;
  };

  return (
    <div className="w-full">
      {/* ===== MOBILE: slider (<768px) ===== */}
      <div className="relative md:hidden">
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory snap-always
                     [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden overscroll-x-contain"
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
                className="object-cover cursor-zoom-in"
                priority={i === 0}
                onClick={openLightbox} // LIGHTBOX: open on click
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
              onClick={() => scrollToIndex(index - 1)}
              disabled={index === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 shadow hover:bg-white disabled:opacity-40"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scrollToIndex(index + 1)}
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

      {/* ===== TABLET: główne + miniatury pod (768–1023px) ===== */}
      <div className="hidden md:flex md:flex-col md:gap-4 lg:hidden">
        <div className="relative h-[70vh] w-full overflow-hidden bg-gray-100">
          <Image
            src={safeImages[index]}
            alt={`${title} ${index + 1}`}
            fill
            sizes="(min-width:768px) 100vw"
            className="object-cover cursor-zoom-in"
            priority
            onClick={openLightbox} // LIGHTBOX
          />
        </div>
        {safeImages.length > 1 && (
          <ul className="grid grid-cols-5 gap-2">
            {safeImages.map((src, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`relative aspect-square w-full overflow-hidden border-2 transition
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
      <div
        className="hidden lg:grid lg:grid-cols-[120px_1fr] lg:gap-1"
        tabIndex={0}
      >
        {safeImages.length > 1 && (
          <ul className="no-scrollbar h-[80vh] overflow-y-auto space-y-3 pr-1">
            {safeImages.map((src, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`relative w-full overflow-hidden  border transition
                    ${
                      i === index
                        ? "border-black ring-2 ring-black/10"
                        : "border-zinc-200 hover:border-black/40"
                    }`}
                  style={{aspectRatio: "1 / 1"}}
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

        <div className="relative h-[80vh] w-full overflow-hidden  bg-gray-100 shadow-sm">
          <Image
            src={safeImages[index]}
            alt={`${title} ${index + 1}`}
            fill
            sizes="(min-width:1024px) 70vw, 100vw"
            className="object-cover cursor-zoom-in"
            priority
            onClick={openLightbox} // LIGHTBOX
          />
          {overlay ? (
            <div className="absolute right-4 top-4 z-10">{overlay}</div>
          ) : null}
        </div>
      </div>

      {/* ------------- LIGHTBOX OVERLAY ------------- */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-black/90"
          onClick={closeLightbox} // klik w tło zamyka
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* CENTER: obraz (klik w obraz NIE zamyka) */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[90vh] w-[90vw] max-w-[1200px]">
              <Image
                src={safeImages[index]}
                alt={`${title} ${index + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* CLOSE */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute right-4 top-4 z-[110] rounded-full bg-white/15 p-2 text-white backdrop-blur hover:bg-white/25"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {/* ARROWS — widoczne i klikalne */}
          {safeImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex((i) => Math.max(0, i - 1));
                }}
                disabled={index === 0}
                className="absolute left-3 top-1/2 z-[110] -translate-y-1/2 rounded-full bg-white/15 p-3 text-white backdrop-blur
                     hover:bg-white/25 disabled:opacity-40"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex((i) => Math.min(safeImages.length - 1, i + 1));
                }}
                disabled={index === safeImages.length - 1}
                className="absolute right-3 top-1/2 z-[110] -translate-y-1/2 rounded-full bg-white/15 p-3 text-white backdrop-blur
                     hover:bg-white/25 disabled:opacity-40"
                aria-label="Next image"
              >
                <ChevronRight className="h-7 w-7" />
              </button>

              {/* DOTS */}
              <div
                className="absolute bottom-5 left-0 right-0 z-[110] flex items-center justify-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                {safeImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    aria-label={`Go to image ${i + 1}`}
                    className={`h-2.5 w-2.5 rounded-full ${
                      i === index ? "bg-white" : "bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
