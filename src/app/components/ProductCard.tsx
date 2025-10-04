"use client";

import {Heart, X} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {useFavorite} from "../../hooks/useFavorite";

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
  onRemoved, // opcjonalne: rodzic może natychmiast usunąć kartę z listy
}: {
  product: Product;
  showHeart?: boolean;
  onRemoved?: (id: string) => void;
}) {
  const {isFav, toggle, remove} = useFavorite(product._id);
  const img = product.images?.[0] ?? "/placeholder.png";

  return (
    <Link href={`/product/${product._id}`} className="block group">
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggle();
              }}
              className="absolute top-2 right-2 rounded-full bg-white/80 p-1 hover:bg-white shadow"
              aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={`h-5 w-5 ${
                  isFav ? "fill-red-500 text-red-500" : "text-zinc-700"
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                remove();
                onRemoved?.(product._id);
              }}
              className="ml-2 rounded-full bg-red-100 p-1 hover:bg-red-200"
              aria-label="Remove from wishlist"
              title="Remove from wishlist"
            >
              <X className="h-4 w-4 text-red-600" />
            </button>
          )}
        </div>
      </article>
    </Link>
  );
}
