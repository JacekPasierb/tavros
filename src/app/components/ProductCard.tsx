// components/ProductCard.tsx
"use client";

import {Heart, X} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {useFavoritesStore} from "@/store/favoritesStore";
import {useSession} from "next-auth/react";
import {useMemo, useState} from "react";
import {useUserFavorites} from "../../lib/useUserFavorites";

export type Product = {
  _id: string;
  slug: string;
  title: string;
  price: number;
  images?: string[];
  inStock?: boolean;
};

export default function ProductCard({
  product,
  showHeart = true,
  onRemoved,
}: {
  product: Product;
  showHeart?: boolean;
  onRemoved?: (id: string) => void;
}) {
  const {status} = useSession();
  const isLoggedIn = status === "authenticated";

  // GOŚĆ (Zustand)
  const isFavGuest = useFavoritesStore((s) => s.isFavorite(product._id));
  const toggleGuest = useFavoritesStore((s) => s.toggle);
  const removeGuest = useFavoritesStore((s) => s.remove);

  // ZALOGOWANY (API / SWR)
  const {
    ids: serverFavIds,
    add,
    remove,
    isLoading: favsLoading,
  } = useUserFavorites();
  const isFavUser = useMemo(
    () => serverFavIds?.has(product._id) ?? false,
    [serverFavIds, product._id]
  );

  const [busy, setBusy] = useState(false);

  const fav = isLoggedIn ? isFavUser : isFavGuest;
  const img = product.images?.[0] ?? "/placeholder.png";
  const disabled = busy || (isLoggedIn && favsLoading);

  async function toggleFavorite() {
    if (disabled) return;
    if (!isLoggedIn) {
      toggleGuest(product._id);
      return;
    }
    try {
      setBusy(true);

      

      if (isFavUser) await remove(product._id);
      else await add(product._id);
     
    } catch (e) {
      console.error(e);
      // opcjonalnie toast/alert
    } finally {
      setBusy(false);
    }
  }

  async function removeFavorite() {
    if (disabled) return;
    if (!isLoggedIn) {
      removeGuest(product._id);
      onRemoved?.(product._id);
      return;
    }
    try {
      setBusy(true);
      await remove(product._id);
      onRemoved?.(product._id);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Link href={`/product/${product._id}`} className="block group">
      <article className="group overflow-hidden bg-transparent transition">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
          <Image
            src={img}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />

          {showHeart && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite();
              }}
              className="absolute top-2 right-2 rounded-full bg-white/80 p-1 hover:bg-white shadow"
              aria-label={fav ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={fav}
              disabled={disabled}
              title={fav ? "W ulubionych" : "Nie w ulubionych"}
            >
              <Heart
                className={`h-5 w-5 ${
                  fav ? "fill-red-500 text-red-500" : "text-zinc-700"
                }`}
              />
            </button>
          )}
        </div>

        <div className="flex items-start justify-between py-3 px-2">
          <div>
            <h3 className="line-clamp-2 text-sm font-medium text-neutral-900">
              {product.title}
            </h3>
            <p className="text-sm text-neutral-700">
              {Intl.NumberFormat("en-GB", {
                style: "currency",
                currency: "GBP",
              }).format(product.price)}
            </p>
          </div>

          {!showHeart && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeFavorite();
              }}
              className="ml-2 rounded-full bg-red-100 p-1 hover:bg-red-200"
              aria-label="Remove from wishlist"
              title="Remove from wishlist"
              disabled={disabled}
            >
              <X className="h-4 w-4 text-red-600" />
            </button>
          )}
        </div>
      </article>
    </Link>
  );
}
