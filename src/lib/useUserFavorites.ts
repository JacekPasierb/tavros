// lib/useUserFavorites.ts
"use client";
import useSWR from "swr";

type FavoriteProduct = {
  _id: string;
  slug: string;
  title: string;
  price: number;
  currency?: string;
  images?: string[];
  collectionSlug?: string;
};

const fetcher = (url: string) =>
  fetch(url).then(async (r) => {
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  });

export function useUserFavorites() {
  const {data, error, isLoading, mutate} = useSWR<{
    ok: boolean;
    data: FavoriteProduct[];
    count: number;
  }>("/api/favorites", fetcher, {revalidateOnFocus: false});

  const products = data?.data ?? [];
  const ids = new Set(products.map((p) => p._id));

  async function add(productId: string) {
    // optymistycznie: dodaj „na sucho”
    mutate(
      (prev) =>
        prev
          ? {
              ...prev,
              data: prev.data.some((p) => p._id === productId)
                ? prev.data
                : [{_id: productId} as FavoriteProduct, ...prev.data],
              count: prev.count + 1,
            }
          : prev,
      false
    );
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({productId}),
    });
    if (!res.ok) {
      // rollback
      mutate();
      throw new Error("POST /api/favorites failed");
    }
    mutate(); // dociągnij pełne dane produktu z backendu
  }

  async function remove(productId: string) {
    mutate(
      (prev) =>
        prev
          ? {
              ...prev,
              data: prev.data.filter((p) => p._id !== productId),
              count: Math.max(0, prev.count - 1),
            }
          : prev,
      false
    );
    const res = await fetch("/api/favorites", {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({productId}),
    });
    if (!res.ok) {
      // rollback
      mutate();
      throw new Error("DELETE /api/favorites failed");
    }
    mutate();
  }

  return {products, ids, isLoading, error, add, remove, mutate};
}
