"use client";

import ProductGallery from "../../components/ProductGallery";
import {useProduct} from "../../hook/useProduct";
import ButtonHeart from "../../components/ButtonHeart";
import ProductInfo from "../../components/ProductInfo";
import useSWR from "swr";
import {useMemo} from "react";
import Slider from "../../components/Slider";
import { Product } from "../../components/ProductCard";

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

  const relatedKey = useMemo(() => {
    if (!gender || !collectionSlug) return null;
    return `/api/products?gender=${encodeURIComponent(
      gender
    )}&collection=${encodeURIComponent(collectionSlug)}&limit=3`;
  }, [gender, collectionSlug]);

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
      <section className="grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-start pb-[50px] lg:px-8 ">
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

      <Slider
        products={products}
        product={product}
        collectionSlug={collectionSlug}
        title="Propose For You"
      />
    </main>
  );
}
