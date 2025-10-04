"use client";

import useSWR from "swr";
import Image from "next/image";
import {Heart, ShoppingCart} from "lucide-react";
import {useFavorite} from "../../../hooks/useFavorite";
import {use, useState} from "react";

type PageProps = {params: Promise<{slug: string}>};
const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function ProductPage({params}: PageProps) {
  const {slug} = use(params);
  const {data, error, isLoading} = useSWR(`/api/products/${slug}`, fetcher, {
    revalidateOnFocus: false,
  });

  const p = data?.data;
  const {isFav, toggle} = useFavorite(p?._id || "");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  if (isLoading) return <p>Loading…</p>;
  if (error || !data?.ok) return <p>Product not found</p>;

  // obsługa dodawania do koszyka
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size first!");
      return;
    }

    // tutaj możesz dodać API / Redux / Context
    const item = {
      id: p._id,
      title: p.title,
      price: p.price,
      size: selectedSize,
      image: p.images?.[0],
      quantity: 1,
    };

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="mx-auto max-w-6xl">
      <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
        <Image
          src={p.images?.[0] ?? "/placeholder.png"}
          alt={p.title}
          fill
          className="object-cover"
        />
        <button
          onClick={toggle}
          className="absolute top-2 right-2 rounded-full bg-white/80 p-2 hover:bg-white shadow"
        >
          <Heart
            className={`h-6 w-6 ${
              isFav ? "fill-red-500 text-red-500" : "text-zinc-700"
            }`}
          />
        </button>
      </div>
<div className="container mx-auto px-3">
      <h1 className="mt-6 text-2xl font-semibold">{p.title}</h1>
      <p className="text-lg mb-4">
        {Intl.NumberFormat("en-GB", {
          style: "currency",
          currency: p.currency ?? "GBP",
        }).format(p.price)}
      </p>

      {/* ✅ wybór rozmiaru */}
      <h2 className="font-medium mb-2">Select size:</h2>
      <ul className="flex gap-3 mb-6">
        {p.variants.map(
          (variant: {size: string; sku: string; stock: number}) => (
            <li key={variant.size}>
              <button
                onClick={() => setSelectedSize(variant.size)}
                disabled={variant.stock < 1}
                className={`border rounded-lg px-4 py-2 ${
                  variant.stock < 1
                    ? "opacity-50 cursor-not-allowed"
                    : selectedSize === variant.size
                    ? "border-black bg-black text-white"
                    : "border-gray-300 hover:border-black"
                }`}
              >
                {variant.size}
              </button>
            </li>
          )
        )}
      </ul>

      {/* ✅ przycisk dodania do koszyka */}
      <button
        onClick={handleAddToCart}
        className={`flex items-center gap-4 px-5 py-7 font-medium transition w-full justify-center item-center uppercase ${
          added
            ? "bg-green-500 text-white"
            : "bg-black text-white hover:bg-neutral-800"
        }`}
      >
        <ShoppingCart className="w-5 h-5" />
        {added ? "Added!" : "Add to cart"}
      </button></div>
    </main>
  );
}
