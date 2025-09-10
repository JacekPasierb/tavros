"use client";

import {useState} from "react";
import "swiper/css";
import "swiper/css/navigation";
import {DATA} from "../data/data";
import CategoryTabs from "../components/CategoryTabs";
import CollectionsGrid from "../components/CollectionsGrid";
import RecommendedSwiper from "../components/RecommendedSwipper";

const Products = () => {
  const [tab, setTab] = useState<"MENS" | "WOMENS">("MENS");
  const {collections, recommended} = DATA[tab];

  return (
    <section className="w-full">
      <CategoryTabs active={tab} onChange={setTab} top="top-12" />
      <CollectionsGrid items={collections} />
      <RecommendedSwiper items={recommended} />
    </section>
  );
};

export default Products;
