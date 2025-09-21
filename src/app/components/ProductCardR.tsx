"use client";

import {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {Heart} from "lucide-react";

export type ProductCardProps = {
  label: string;
  href: string;
  img: string;
  price: number;
};

const ProductCard = ({label, href, img, price}: ProductCardProps) => {
  const [fav, setFav] = useState(false);

  const toggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    setFav((prev) => !prev);
  };

  return (
    <Link
      href={href}
      className="block   bg-white transition"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
        <Image
          src={img}
          alt={label}
          fill
          sizes="224px"
          className="h-full w-full object-cover transition-transform duration-300  hover:scale-105"
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

      <div className="p-3">
        <p className="text-sm">{label}</p>
        <p className="text-sm font-bold">   {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "GBP",
            }).format(Number(price))}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
