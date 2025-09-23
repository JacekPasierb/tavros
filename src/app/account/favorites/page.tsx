// app/account/favorites/page.tsx
"use client";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import ProductCard from "@/app/components/ProductCard";

const fetcher = (u: string) => fetch(u).then(r => r.json());

export default function FavoritesPage() {
  const router = useRouter();
  const { data, error, isLoading } = useSWR("/api/favorites", fetcher, {
    revalidateOnFocus: false,
  });

  if (error) {
    // jeśli 401, przekieruj do logowania
    if (error.status === 401) router.push("/account/signin");
    return <main className="mx-auto max-w-7xl px-4 py-8">
      <p className="text-red-600">Błąd wczytywania ulubionych.</p>
    </main>;
  }

  const products = data?.data ?? [];
  const count = data?.count ?? 0;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h2 className="mb-2 text-2xl font-semibold">Favorites</h2>
      <p className="mb-6 text-sm text-zinc-500">Items: {count}</p>

      {isLoading && <p className="text-sm text-zinc-500">Ładowanie…</p>}

      {!isLoading && products.length === 0 && (
        <p className="text-sm text-zinc-500">Brak ulubionych produktów.</p>
      )}

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p: any) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </section>
    </main>
  );
}
