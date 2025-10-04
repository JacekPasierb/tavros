"use client";

import useSWR from "swr";
import Image from "next/image";
import {Heart} from "lucide-react";
import {useFavorite} from "../../../hooks/useFavorite";
import {use} from "react";

type PageProps = {params: Promise<{slug: string}>};
const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function ProductPage({params}: PageProps) {
  const {slug} = use(params);

  const {data, error, isLoading} = useSWR(`/api/products/${slug}`, fetcher, {
    revalidateOnFocus: false,
  });
  const p = data?.data;

  const {isFav, toggle} = useFavorite(p?._id || "");

  if (isLoading) return <p>Loading…</p>;
  if (error || !data?.ok) return <p>Product not found</p>;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={p.images?.[0] ?? "/placeholder.png"}
          alt={p.title}
          fill
          className="object-cover"
        />
      </div>
      <h1 className="mt-6 text-2xl font-semibold">{p.title}</h1>
      <p className="text-lg">
        {Intl.NumberFormat("en-GB", {
          style: "currency",
          currency: p.currency ?? "GBP",
        }).format(p.price)}
      </p>
      <button
        onClick={toggle}
        className=" rounded-full bg-white/80 p-2 hover:bg-white shadow"
      >
        <Heart
          className={`h-6 w-6 ${
            isFav ? "fill-red-500 text-red-500" : "text-zinc-700"
          }`}
        />
      </button>
      <h2>Select size:</h2>
      <ul className="flex gap-3 my-2">
        {data.data.variants.map(
          (variant: {size: string; sku: string; stock: number}) => (
            <li
              key={variant.size}
              className={`border border-gray-200 rounded-lg p-2 w-10 h-10 text-center
                ${variant.stock < 1 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {variant.size}
            </li>
          )
        )}
      </ul>
    </main>
  );
}
