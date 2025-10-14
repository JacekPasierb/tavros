"use client";

import ProductCardR, { ProductCardProps } from "./ProductCardR";
import TitleSection from "./TitleSection";
import { motion } from "framer-motion";

export default function RecommendedSwiper({
  items,
}: {
  items: ProductCardProps[];
}) {
  return (
    <section className="container mx-auto px-4 my-[25px] md:my-[50px] pb-10 flex flex-col items-center">
      {/* Tytuł wyśrodkowany */}
      <div className="mb-6 w-full text-center">
        <TitleSection title="Recommended for you" />
      </div>

      {/* Slider (mobile) / Grid (desktop) */}
      <div
        className="
          w-full max-w-[1200px]
          overflow-x-auto no-scrollbar
          flex gap-4 snap-x snap-mandatory px-2
          min-[1000px]:grid min-[1000px]:grid-cols-4 min-[1000px]:gap-6
          min-[1000px]:overflow-visible min-[1000px]:px-0
        "
        aria-label="Recommended products"
      >
        {items.map((p, i) => (
          <motion.div
            key={p.href}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="
              snap-start shrink-0
              w-[240px]
              min-[380px]:w-64
              min-[1000px]:w-auto min-[1000px]:shrink
            "
          >
            <ProductCardR {...p} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
