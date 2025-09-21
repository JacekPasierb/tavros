"use client";

import {useState} from "react";
import "swiper/css";
import "swiper/css/navigation";
import {DATA} from "../data/data";
import CategoryTabs from "../components/CategoryTabs";
import CollectionsGrid from "../components/CollectionsGrid";
import RecommendedSwiper from "../components/RecommendedSwipper";

import useSWR from "swr";
const fetcher = (url: string) => fetch(url).then(r => r.json());



const Products = () => {
  const [tab, setTab] = useState<"MENS" | "WOMENS" | "KIDS" >("MENS");
  const { recommended} = DATA[tab];

  const { data: colData } = useSWR(
    `/api/collections?gender=${tab}`,
    fetcher,
    { keepPreviousData: true }
  );
  
  console.log("Da",colData);
  
  const collections = colData?.items ?? [];
  return (
    <section className="w-full">
      <CategoryTabs active={tab} onChange={setTab} top="top-12" />
      <CollectionsGrid items={collections} />
      <RecommendedSwiper items={recommended} />
    </section>
  );
};

export default Products;
