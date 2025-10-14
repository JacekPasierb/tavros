"use client";

import ProductGallery from "../../components/ProductGallery";
import {useProduct} from "../../hook/useProduct";
import ButtonHeart from "../../components/ButtonHeart";
import ProductInfo from "../../components/ProductInfo";
import TitleSection from "../../components/TitleSection";
import useSWR from "swr";
import ProductCard, {Product} from "../../components/ProductCard";
import {useMemo} from "react";
import {useResponsiveLimit} from "../../hook/useResponsiveLimit";
import {motion} from "framer-motion";
import Link from "next/link";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function ProductPage() {
  const {product, isLoading, error, toggleFavorite, fav, disabled} =
    useProduct();

  // ⚠️ Zdarza się, że w modelu jest `collectionSlug` (pojedyncze), nie `collectionsSlug`.
  const gender = product?.gender;
  const collectionSlug =
    (product as {collectionSlug?: string; collectionsSlug?: string})
      ?.collectionSlug ??
    (product as {collectionSlug?: string; collectionsSlug?: string})
      ?.collectionsSlug;

  // Zbuduj klucz TYLKO gdy mamy oba parametry; dodaj encode i (opcjonalnie) upper-case, jeśli API wymaga
  const limit = useResponsiveLimit();
  const relatedKey = useMemo(() => {
    if (!gender || !collectionSlug || limit == null) return null;
    return `/api/collections/${encodeURIComponent(gender)}/${encodeURIComponent(
      collectionSlug
    )}/products?limit=${limit}`;
  }, [gender, collectionSlug, limit]);

  // Pomocniczy log – zobaczysz, czy wartości istnieją i jaki jest klucz
  if (process.env.NODE_ENV !== "production") {
    // nie robi crasha gdy undefined
    console.debug("related params:", {gender, collectionSlug, relatedKey});
  }

  const {data} = useSWR(relatedKey, fetcher, {
    revalidateOnFocus: false,
  });

  const products: Product[] = data?.data ?? [];

  if (isLoading)
    return <main className="mx-auto w-full px-4 py-6">Loading…</main>;
  if (error || !product)
    return <main className="mx-auto w-full px-4 py-6">Product not found</main>;

  return (
    <main className="mx-auto w-full  lg:py-6 pb-4">
      <section className="grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-start pb-[50px] lg:px-8 " >
        <ProductGallery
          images={product.images}
          title={product.title}
          overlay={
            <ButtonHeart
              fav={fav}
              toggle={toggleFavorite}
              disabled={disabled}
            />
          }
        />
        <ProductInfo product={product} />
      </section>

      <section className="bg-[#f6f6f6] py-6 px-4 flex flex-col items-center sm:px-6 lg:px-8">
  <div className="mb-6 w-full text-center">
    <TitleSection title="Propose For You" />
   
  </div>

  {/* SLIDER */}
  <div
    className="
      w-full max-w-[1200px]
      overflow-x-auto no-scrollbar
      flex gap-4 snap-x snap-mandatory
      px-4
      min-[1000px]:grid min-[1000px]:grid-cols-3 min-[1000px]:gap-6
      min-[1000px]:overflow-visible min-[1000px]:px-0
    "
  >
    {products.map((p, i) => (
      <motion.div
        key={p._id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: i * 0.06 }}
        className="
          snap-start shrink-0
          w-[260px]   /* stabilna szerokość kafelka na mobile */
          min-[380px]:w-72
          min-[1000px]:w-auto min-[1000px]:shrink
        "
      >
        <ProductCard product={p} showHeart />
      </motion.div>
    ))}
  </div>

  <div className="mt-6 flex justify-center w-full">
    <Link
      href={`/collections/${product.gender}/${collectionSlug}`}
      prefetch={false}
      className="inline-flex items-center  bg-black px-5 py-2 text-white text-sm font-medium hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black/20"
    >
      View collection
    </Link>
  </div>
</section>

    </main>
  );
}
