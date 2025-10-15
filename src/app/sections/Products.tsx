"use client";

import {useState} from "react";
import "swiper/css";
import "swiper/css/navigation";
import CategoryTabs from "../components/CategoryTabs";
import CollectionsGrid from "../components/CollectionsGrid";
import RecommendedSwiper from "../components/RecommendedSwipper";

import useSWR from "swr";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

const Products = () => {
  const [tab, setTab] = useState<"MENS" | "WOMENS" | "KIDS">("MENS");
  

  // const {data: colData} = useSWR(`/api/collections?gender=${tab}`, fetcher, {
  //   keepPreviousData: true,
  // });

  // const collections = colData?.items ?? [];
  const { data } = useSWR(`/api/collections?gender=${tab}`, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });
  const collections = data?.items ?? [];

  console.log("ddd",collections);
  

  interface ProductApiItem {
    _id: string;
    title: string;
    price: number;
    images: string[];
    slug: string;
    oldPrice?: number;
    isNew?: boolean;
    isSale?: boolean;
  }

  // const { data: recommendedData } = useSWR(
  //   "/api/products?isRecommended=true", // Hypothetical API endpoint for recommended products
  //   fetcher,
  //   { revalidateOnFocus: false } // Prevent re-fetching on window focus
  // );

  // const recommendedProducts = (recommendedData?.data ?? []).map((p: ProductApiItem) => ({
  //   href: `/product/${p.slug}`,
  //   img: p.images[0], // Assuming the first image in the array is the main one
  //   label: p.title,
  //   price: p.price,
  // }));

  // To complete the task and display the recommended products section,
  // you should render the `RecommendedSwiper` component in the JSX return block.
  // For example, you could add it after `CollectionsGrid`:
  //
  // <CollectionsGrid items={collections} />
  // {recommendedProducts.length > 0 && (
  //   <RecommendedSwiper items={recommendedProducts} />
  // )}
  //
  // You might also want to show a loading state or handle errors for recommended products.

  return (
    <section className=" w-full">
      <CategoryTabs active={tab} onChange={setTab} />
      <CollectionsGrid items={collections} />
      
      {/* {recommendedProducts.length > 0 && (
        <RecommendedSwiper items={recommendedProducts} />
      )} */}

    </section>
  );
};

export default Products;
