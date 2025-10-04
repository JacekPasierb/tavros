"use client";

import { Heart, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export type Product = {
  _id: string;
  title: string;
  price: number;
  images?: string[];
  inStock?: boolean;
};

export default function ProductCard({
  product,
  showHeart = true,
  onRemoved, // opcjonalne: rodzic może natychmiast usunąć kartę z listy
}: {
  product: Product;
  showHeart?: boolean;
  onRemoved?: (id: string) => void;
}) {
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  const [fav, setFav] = useState(false);

  // sprawdź czy produkt jest w ulubionych
  useEffect(() => {
    (async () => {
      if (isLoggedIn) {
        const res = await fetch("/api/favorites", { cache: "no-store" });
        if (!res.ok) return setFav(false);
        const json = await res.json();
        // json.data = lista produktów → zmapuj do ID
        const ids: string[] = Array.isArray(json?.data)
          ? json.data.map((p: { _id: string }) => String(p._id))
          : [];
        setFav(ids.includes(product._id));
      } else if (typeof window !== "undefined") {
        const ids: string[] = JSON.parse(localStorage.getItem("favorites") || "[]");
        setFav(ids.includes(product._id));
      }
    })();
  }, [isLoggedIn, product._id]);

  // toggle serduszka (na listingach)
  const toggleFav = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (isLoggedIn) {
      const method = fav ? "DELETE" : "POST";
      await fetch("/api/favorites", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
      });
      setFav(!fav);
      if (fav && !showHeart) onRemoved?.(product._id); // jeśli na stronie favorites – usuń kartę
    } else if (typeof window !== "undefined") {
      const ids: string[] = JSON.parse(localStorage.getItem("favorites") || "[]");
      const next = fav
        ? ids.filter((x) => x !== product._id)                       // usuwanie
        : Array.from(new Set([...ids, product._id]));                // dodawanie
      localStorage.setItem("favorites", JSON.stringify(next));
      setFav(!fav);
      if (fav && !showHeart) onRemoved?.(product._id);
    }
  };

  // przycisk „Usuń” na stronie ulubionych (showHeart = false)
  const removeFav = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (isLoggedIn) {
      await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
      });
    } else if (typeof window !== "undefined") {
      const ids: string[] = JSON.parse(localStorage.getItem("favorites") || "[]");
      localStorage.setItem("favorites", JSON.stringify(ids.filter((x) => x !== product._id)));
    }

    setFav(false);
    onRemoved?.(product._id); // optymistycznie usuń kartę w UI
  };

  const img = product.images?.[0] ?? "/placeholder.png";

  return (
    <article className="group overflow-hidden bg-white transition">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
        <Image
          src={img}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {showHeart && (
          <button
            onClick={toggleFav}
            className="absolute top-2 right-2 rounded-full bg-white/80 p-1 hover:bg-white shadow"
            aria-label={fav ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-5 w-5 ${fav ? "fill-red-500 text-red-500" : "text-zinc-700"}`} />
          </button>
        )}
      </div>

      <div className="flex items-start justify-between py-3 px-2">
        <div>
          <h3 className="line-clamp-2 text-sm font-medium text-neutral-900">{product.title}</h3>
          <p className="text-sm text-neutral-700">
            {Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(product.price)}
          </p>
        </div>

        {!showHeart && (
          <button
            onClick={removeFav}
            className="ml-2 rounded-full bg-red-100 p-1 hover:bg-red-200"
            aria-label="Remove from wishlist"
            title="Remove from wishlist"
          >
            <X className="h-4 w-4 text-red-600" />
          </button>
        )}
      </div>
    </article>
  );
}
