"use client";

import useSWR from "swr";
import { useEffect, useState } from "react";
import ProductCard, { Product } from "@/app/components/ProductCard";

// ——— helpers ———
type HttpError = Error & { status?: number };

const fetcher = async (url: string) => {
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) {
    const err: HttpError = Object.assign(new Error("Fetch error"), { status: r.status });
    throw err;
  }
  return r.json();
};

function readLocalFavIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("favorites");
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.map(String) : [];
  } catch {
    return [];
  }
}

// ——— page ———
export default function FavoritesPage() {
  // Zalecane: endpoint zwracający { data: Product[], count: number } dla zalogowanego
  const { data, error, isLoading } = useSWR("/api/favorites", fetcher, {
    revalidateOnFocus: false,
  });

  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const isGuest = (error as HttpError | undefined)?.status === 401;

  // Fallback dla niezalogowanych – pobierz produkty po ID z localStorage
  useEffect(() => {
    if (!isGuest) return;

    const ids = readLocalFavIds();
    if (ids.length === 0) {
      setLocalProducts([]);
      return;
    }

    (async () => {
      const res = await fetch(`/api/products?ids=${ids.join(",")}`, { cache: "no-store" });
      if (!res.ok) {
        setLocalProducts([]);
        return;
      }
      const json = await res.json();
      // oczekiwany kształt: { data: Product[] }
      setLocalProducts(Array.isArray(json?.data) ? json.data : []);
    })();
  }, [isGuest]);

  const products: Product[] = isGuest ? localProducts : data?.data ?? [];
  const count: number = isGuest ? localProducts.length : data?.count ?? 0;

  return (
    <main className="container mx-auto text-center px-4 py-8">
      <h2 className="mb-2 text-2xl font-semibold uppercase">My Wishlist</h2>
      <p className="mb-6 text-sm text-zinc-500">All Products: {count}</p>

      {isGuest && (
        <p className="mb-6 text-sm text-zinc-500">
          Your favourite products are saved only in this browser.
          Create a free Tavros account to keep your favourites safe across all devices and never lose them.
        </p>
      )}

      {isLoading && <p className="text-sm text-zinc-500">Loading…</p>}

      {!isLoading && products.length === 0 && (
        <p className="text-sm text-zinc-500">No favourite products yet.</p>
      )}

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p: Product) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </section>
    </main>
  );
}
