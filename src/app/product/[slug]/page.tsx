// app/(shop)/product/[slug]/page.client.tsx
"use client";

import useSWR from "swr";
import Image from "next/image";
import {Heart} from "lucide-react";
import {useParams} from "next/navigation";
import {useMemo, useState} from "react";
import {useUserFavorites} from "@/lib/useUserFavorites";
import {useSession} from "next-auth/react";
import {useFavoritesStore} from "@/store/favoritesStore";

const fetcher = async (u: string) => {
  const r = await fetch(u);
  if (!r.ok) throw new Error("Failed to fetch product");
  return r.json();
};

export default function ProductPage() {
  const {slug} = useParams<{slug: string}>();
  const {status} = useSession();
  const isLoggedIn = status === "authenticated";

  // 1) Pobierz produkt po SLUGU
  const {data, error, isLoading} = useSWR(
    slug ? `/api/products/${slug}` : null,
    fetcher,
    {revalidateOnFocus: false}
  );

  const p = data?.data as {
    _id: string;
    title: string;
    price: number;
    currency?: string;
    images?: string[];
    variants?: {size: string; sku: string; stock: number}[];
  } | undefined;

  // ✅ kluczowa rzecz: od teraz operujemy NA _id, nie na slugu
  const productId = p?._id || "";

  // 2) Ulubione – zalogowany (Twoje API)
  const {
    ids: serverFavIds,
    add,
    remove,
    isLoading: favsLoading,
  } = useUserFavorites();

  const isFavUser = useMemo(
    () => serverFavIds?.has(productId) ?? false,
    [serverFavIds, productId]
  );

  // 3) Ulubione – gość (Zustand)
  const isFavGuest = useFavoritesStore((s) => s.isFavorite(productId));
  const toggleGuest = useFavoritesStore((s) => s.toggle);

  const [busy, setBusy] = useState(false);
  const disabled = busy || (isLoggedIn && favsLoading);

  // 4) Rozmiary – guard + memo
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const variants = useMemo(() => p?.variants ?? [], [p?.variants]);

  if (isLoading) return <main className="mx-auto max-w-6xl p-6">Loading…</main>;
  if (error || !data?.ok || !data.data)
    return <main className="mx-auto max-w-6xl p-6">Product not found</main>;

  const fav = isLoggedIn ? isFavUser : isFavGuest;

  async function toggleFavorite() {
    if (disabled) return;
    if (!productId) return;

    if (!isLoggedIn) {
      // gość → lokalny store po ID
      toggleGuest(productId);
      return;
    }

    try {
      setBusy(true);
      if (isFavUser) await remove(productId);
      else await add(productId);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl">
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <Image
          src={p?.images?.[0] ?? "/placeholder.png"}
          alt={p?.title ?? "Product"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* ❤️ serduszko */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite();
          }}
          disabled={disabled}
          className="absolute right-2 top-2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
          aria-label={fav ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={fav}
          title={fav ? "W ulubionych" : "Nie w ulubionych"}
        >
          <Heart
            className={`h-6 w-6 ${
              fav ? "fill-red-500 text-red-500" : "text-zinc-700"
            }`}
          />
        </button>
      </div>

      <div className="container mx-auto px-3">
        <h1 className="mt-6 text-2xl font-semibold">{p?.title}</h1>
        <p className="mb-4 text-lg">
          {Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: p?.currency ?? "GBP",
          }).format(p?.price ?? 0)}
        </p>

        {!!variants.length && (
          <>
            <h2 className="mb-2 font-medium">Select size:</h2>
            <ul className="mb-6 flex gap-3">
              {variants.map((variant) => (
                <li key={variant.size}>
                  <button
                    onClick={() => setSelectedSize(variant.size)}
                    disabled={variant.stock < 1}
                    className={`rounded-lg border px-4 py-2 ${
                      variant.stock < 1
                        ? "cursor-not-allowed opacity-50"
                        : selectedSize === variant.size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-black"
                    }`}
                  >
                    {variant.size}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </main>
  );
}
