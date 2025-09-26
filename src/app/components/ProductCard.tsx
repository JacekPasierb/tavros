

import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

export type Product = {
  _id: string;
  title: string;
  price: number;
  images?: string[];
  inStock?: boolean;
};

const ProductCard = ({ product }: { product: Product }) => {
  const [fav, setFav] = useState(false);
  const { data: session } = useSession();

  // ✅ Sprawdź, czy produkt jest w ulubionych przy pierwszym renderze
  useEffect(() => {
    if (session) {
      // zalogowany – pobierz ulubione z API
      const fetchFavorites = async () => {
        const res = await fetch("/api/favorites");
        if (res.ok) {
          const favs: string[] = await res.json();
          setFav(favs.includes(product._id));
        }
      };
      fetchFavorites();
    } else {
      // niezalogowany – sprawdź localStorage
      if (typeof window !== "undefined") {
        const favs: string[] = JSON.parse(localStorage.getItem("favorites") || "[]");
        setFav(favs.includes(product._id));
      }
    }
  }, [session, product._id]);

  const toggleFav = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (session) {
      // wyślij do API
      await fetch("/api/favorites", {
        method: "POST",
        body: JSON.stringify({ productId: product._id }),
        headers: { "Content-Type": "application/json" },
      });
      setFav((prev) => !prev);
    } else {
      // zapis w localStorage
      setFav((prev) => {
        const newFav = !prev;

        if (typeof window !== "undefined") {
          const favs: string[] = JSON.parse(localStorage.getItem("favorites") || "[]");
          if (newFav) {
            localStorage.setItem("favorites", JSON.stringify([...favs, product._id]));
          } else {
            localStorage.setItem(
              "favorites",
              JSON.stringify(favs.filter((id) => id !== product._id))
            );
          }
        }

        return newFav;
      });
    }
  };

  const img = product.images?.[0] ?? "/placeholder.png";

  return (
    <article className="group overflow-hidden bg-white transition">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <button
          onClick={toggleFav}
          className="absolute top-2 right-2 rounded-full bg-white/80 p-1 hover:bg-white shadow"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`h-5 w-5 ${
              fav ? "fill-red-500 text-red-500" : "text-zinc-700"
            }`}
          />
        </button>
      </div>
      <div className="space-y-1 p-3">
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
    </article>
  );
};

export default ProductCard;
