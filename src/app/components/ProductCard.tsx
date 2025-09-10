"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react"; // 👈 ikona serca

export type ProductCardProps = {
  label: string;
  href: string;
  img: string;
  price: string;
};

const ProductCard = ({ label, href, img, price }: ProductCardProps) => {
  const [fav, setFav] = useState(false);

  const toggleFav = (e: React.MouseEvent) => {
    e.preventDefault(); // 👈 żeby kliknięcie serduszka nie otwierało linka
    setFav((prev) => !prev);
  };

  return (
    <Link
      href={href}
      className="block rounded-lg border bg-white transition hover:shadow"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-lg">
        {/* Obrazek */}
        <Image
          src={img}
          alt={label}
          fill
          sizes="224px"
          className="object-cover"
        />

        {/* Serduszko w rogu */}
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

      {/* Opis */}
      <div className="p-3">
        <p className="text-sm">{label}</p>
        <p className="text-sm font-bold">{price}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
