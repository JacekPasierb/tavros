"use client";

import useSWR from "swr";
import {useEffect, useState} from "react";
import ProductCard, {Product} from "@/app/components/ProductCard";
import {useSession} from "next-auth/react";

const FavoritesPage = () => {
  const {data: session} = useSession();
  const isLoggedIn = !!session;

  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [ids, setIds] = useState<string[] | null>(null);

  useEffect(() => {
    if (isLoggedIn) return;
    const raw = localStorage.getItem("favorites") || "[]";
    const favs = JSON.parse(raw);
    if (Array.isArray(favs)) setIds(favs);
  }, [isLoggedIn]);

  const {data, mutate} = useSWR(
    isLoggedIn ? "/api/favorites" : ids ? `/api/products?ids=${ids}` : null,
    (url: string) => fetch(url).then((r) => r.json()),
    {revalidateOnFocus: false}
  );

  useEffect(() => {
    if (!isLoggedIn && Array.isArray(data?.data)) {
      setLocalProducts(data.data);
    }
  }, [data, isLoggedIn]);

  // 🔥 callback przekazywany do ProductCard
  const handleRemove = async (id: string) => {
    if (isLoggedIn) {
      // Optymistyczna aktualizacja UI (bez reloadu)
      mutate(
        (prev: {data: Product[]} | undefined) =>
          prev
            ? {...prev, data: prev.data.filter((p: Product) => p._id !== id)}
            : prev,
        false
      );
    } else {
      // usuń z localStorage i stanu
      const updated = localProducts.filter((p) => p._id !== id);
      localStorage.setItem(
        "favorites",
        JSON.stringify(updated.map((p) => p._id))
      );
      setLocalProducts(updated);
    }
  };

  const products = isLoggedIn ? data?.data ?? [] : localProducts;

  return (
    <main className="container mx-auto px-4 py-8 text-center">
      <h2 className="mb-2 text-2xl font-semibold uppercase">My Wishlist</h2>
      <p className="mb-6 text-sm text-zinc-500">
        All Products: {products.length}
      </p>
      {!isLoggedIn && (
        <p className="mb-6 text-sm text-zinc-500">
          Your favourite products are saved only in this browser. Create a free
          Tavros account to keep your favourites safe across all devices and
          never lose them.
        </p>
      )}
      {products.length === 0 && (
        <p className="text-sm text-zinc-500">No favourite products yet.</p>
      )}

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p: Product) => (
          <ProductCard
            key={p._id}
            product={p}
            showHeart={false} // ❌ ukrywamy serduszko
            onRemoved={handleRemove} // ✅ przekazujemy callback
          />
        ))}
      </section>
    </main>
  );
};

export default FavoritesPage;
