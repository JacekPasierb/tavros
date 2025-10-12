"use client";

import ProductGallery from "../../components/ProductGallery";
import { useProduct } from "../../hook/useProduct";
import ButtonHeart from "../../components/ButtonHeart";
import ProductInfo from "../../components/ProductInfo";
import TitleSection from "../../components/TitleSection";
import useSWR from "swr";
import ProductCard, { Product } from "../../components/ProductCard";
import { useMemo } from "react";
import { useResponsiveLimit } from "../../hook/useResponsiveLimit";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function ProductPage() {
  const { product, isLoading, error, toggleFavorite, fav, disabled } = useProduct();

  // ⚠️ Zdarza się, że w modelu jest `collectionSlug` (pojedyncze), nie `collectionsSlug`.
  const gender = product?.gender;
  const collectionSlug = (product as { collectionSlug?: string; collectionsSlug?: string })?.collectionSlug ?? (product as { collectionSlug?: string; collectionsSlug?: string })?.collectionsSlug;

  // Zbuduj klucz TYLKO gdy mamy oba parametry; dodaj encode i (opcjonalnie) upper-case, jeśli API wymaga
  const limit = useResponsiveLimit();
  const relatedKey = useMemo(() => {
    if (!gender || !collectionSlug) return null;
    return `/api/collections/${encodeURIComponent(gender)}/${encodeURIComponent(collectionSlug)}/products?limit=${limit}`;
  }, [gender, collectionSlug, limit]);

  // Pomocniczy log – zobaczysz, czy wartości istnieją i jaki jest klucz
  if (process.env.NODE_ENV !== "production") {
    // nie robi crasha gdy undefined
    console.debug("related params:", { gender, collectionSlug, relatedKey });
  }

  const { data } = useSWR(relatedKey, fetcher, {
    revalidateOnFocus: false,
  });

  const products: Product[] = data?.data ?? [];

  if (isLoading)
    return <main className="mx-auto w-full px-4 py-6">Loading…</main>;
  if (error || !product)
    return <main className="mx-auto w-full px-4 py-6">Product not found</main>;

  return (
    <main className="mx-auto w-full lg:max-w-6xl lg:py-6 pb-4">
      <section className="grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-start pb-[50px] lg:px-8">
        <ProductGallery
          images={product.images}
          title={product.title}
          overlay={<ButtonHeart fav={fav} toggle={toggleFavorite} disabled={disabled} />}
        />
        <ProductInfo product={product} />
      </section>

      <section className="bg-[#f6f6f6] py-4 px-8">
        <TitleSection title="Propose For You" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} showHeart />
          ))}
        </div>
      </section>
    </main>
  );
}
