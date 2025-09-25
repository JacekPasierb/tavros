"use client";

import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, A11y} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import ProductCardR, {ProductCardProps} from "./ProductCardR";
import TitleSection from "./TitleSection";

export default function RecommendedSwiper({
  items,
}: {
  items: ProductCardProps[];
}) {
  return (
    <div className="container mx-auto px-4  pb-10 my-[25px] md:my-[50px]">
      <TitleSection title={"Recommended for you"} />
      <Swiper
        modules={[Navigation, A11y]}
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
            <ProductCardR {...p} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
