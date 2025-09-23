import { Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react'

export type Product = {
    _id: string;
    title: string;
    price: number;
    images?: string[];
    inStock?: boolean;
  };

const ProductCard = ({product}: {product: Product}) =>{
    const [fav, setFav] = useState(false);
    const { data: session } = useSession();

    const toggleFav = async (e: React.MouseEvent) => {
      e.preventDefault();
    
      if (session) {
        // wyślij do API
        await fetch("/api/favorites", {
          method: "POST",
          body: JSON.stringify({ productId: product._id }),
          headers: { "Content-Type": "application/json" },
        });
      } else {
        // zapis w localStorage
        setFav((prev) => {
          const newFav = !prev;
      
          if (typeof window !== "undefined") {
            const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
            if (newFav) {
              localStorage.setItem("favorites", JSON.stringify([...favs, product._id]));
            } else {
              localStorage.setItem(
                "favorites",
                JSON.stringify(favs.filter((id: string) => id !== product._id))
              );
            }
          }
      
          return newFav;
        });
      }
    };
  
    const img = product.images?.[0] ?? "/placeholder.png";
    return (
      <article className="group overflow-hidden   bg-white  transition ">
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
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "GBP",
            }).format(product.price)}
          </p>
        </div>
      </article>
    );
  }
  

export default ProductCard