// app/(shop)/product/[slug]/page.client.tsx
"use client";

import useSWR from "swr";
import {Heart} from "lucide-react";
import {useParams} from "next/navigation";
import {useMemo, useState} from "react";
import {useUserFavorites} from "@/lib/useUserFavorites";
import {useSession} from "next-auth/react";
import {useFavoritesStore} from "@/store/favoritesStore";
import ProductGallery from "../../components/ProductGallery";

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

  const p = data?.data as
    | {
        _id: string;
        title: string;
        price: number;
        currency?: string;
        images?: string[];
        variants?: {size: string; sku: string; stock: number}[];
      }
    | undefined;

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
    <main className="mx-auto  px-3 lg:px-6 lg:py-3">
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-start">
        {/* === LEWA: GALERIA === */}
        <ProductGallery
          images={p?.images}
          title={p?.title ?? "Product"}
          overlay={
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite();
              }}
              disabled={disabled}
              className="rounded-full bg-white/80 p-2 shadow hover:bg-white"
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
          }
        />

        {/* === PRAWA: OPIS PRODUKTU === */}
        <div className="lg:sticky lg:top-10  mx-auto ">
          <h1 className="mt-6 text-2xl font-semibold lg:mt-0">{p?.title}</h1>
          <p className="mb-6 text-lg font-medium text-gray-800">
            {Intl.NumberFormat("en-GB", {
              style: "currency",
              currency: p?.currency ?? "GBP",
            }).format(p?.price ?? 0)}
          </p>

          {!!variants.length && (
            <>
              <h2 className="mb-2 font-medium">Select size:</h2>
              <ul className="grid grid-cols-4 gap-3 sm:grid-cols-4 my-4">
                {variants.map((v) => {
                  const disabled = v.stock < 1;
                  const selected = selectedSize === v.size;

                  return (
                    <li key={v.size} className="contents">
                      <button
                        type="button"
                        onClick={() => !disabled && setSelectedSize(v.size)}
                        disabled={disabled}
                        aria-pressed={selected}
                        aria-label={`Size ${v.size}${
                          disabled ? " (out of stock)" : ""
                        }`}
                        className={[
                          "relative w-full select-none  border px-0 text-sm transition",
                          "h-11 min-w-[5rem]", // sztywna wysokość jak u konkurencji
                          "flex items-center justify-center", // wyśrodkowanie
                          selected
                            ? "border-black bg-black text-white"
                            : "border-zinc-300 bg-white text-zinc-900 hover:border-black",
                          disabled &&
                            "cursor-not-allowed border-zinc-200 bg-zinc-50 text-zinc-400 hover:border-zinc-200",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20",
                        ].join(" ")}
                      >
                        {/* label */}
                        <span className="font-medium">{v.size}</span>

                        {/* przekreślenie dla out-of-stock */}
                        {disabled && (
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 flex items-center justify-center"
                          >
                            <span className="block h-px w-8 rotate-12 bg-zinc-300" />
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          <button
            type="button"
            className="w-full  bg-black px-6 py-3 text-white hover:bg-black/90"
          >
            Add to cart
          </button>
        </div>
      </div>
    </main>
  );
}
