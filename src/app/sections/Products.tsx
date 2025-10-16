"use client";

import {useState} from "react";
import "swiper/css";
import "swiper/css/navigation";
import CategoryTabs from "../components/CategoryTabs";
import CollectionsGrid from "../components/CollectionsGrid";
import useSWR from "swr";
import Slider from "../components/Slider";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const Products = () => {
  const [tab, setTab] = useState<"MENS" | "WOMENS" | "KIDS">("MENS");

  const {data} = useSWR(`/api/collections?gender=${tab}`, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });
  const collections = data?.items ?? [];

  const {data: recData} = useSWR(
    `/api/products?isRecommended=true&gender=${tab}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const products = recData?.data ?? [];

  return (
    <section className=" w-full">
      <CategoryTabs active={tab} onChange={setTab} />
      <CollectionsGrid items={collections} />
      <div id="best-sellers" className="mt-10">
        <Slider products={products} title="Best Sellers" />
      </div>
    </section>
  );
};

export default Products;
