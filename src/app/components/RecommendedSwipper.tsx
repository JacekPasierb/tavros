"use client";

import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, A11y} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import ProductCard, {ProductCardProps} from "./ProductCard";

export default function RecommendedSwiper({
  items,
}: {
  items: ProductCardProps[];
}) {
  return (
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
          640: {slidesPerView: 3},
          1024: {slidesPerView: 4},
        }}
        className="w-full"
      >
        {items.map((p) => (
          <SwiperSlide key={p.href}>
            <ProductCard {...p} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
