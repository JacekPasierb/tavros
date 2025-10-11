"use client";

import {useMemo} from "react";
import useSWR from "swr";
import {useRouter, useSearchParams} from "next/navigation";
import ProductCard, {Product} from "../../../components/ProductCard";

const fetcher = (u: string) => fetch(u).then((r) => r.json());
const ALL_SIZES = ["XS", "S", "M", "L", "XL"];

export default function CollectionClient({
  gender,
  slug,
}: {
  gender: string;
  slug: string;
}) {
  const sp = useSearchParams();
  const router = useRouter();

  const sort = sp.get("sort") ?? "newest";
  const inStock = sp.get("inStock") === "true";
  const sizes = sp.getAll("sizes");

  const apiUrl = useMemo(() => {
    const qs = new URLSearchParams();
    if (sort) qs.set("sort", sort);
    if (inStock) qs.set("inStock", "true");
    sizes.forEach((s) => qs.append("sizes", s));
    const q = qs.toString();
    return `/api/collections/${gender}/${slug}/products${q ? `?${q}` : ""}`;
  }, [gender, slug, sort, inStock, sizes]);

  const {data, error, isLoading} = useSWR(apiUrl, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  const products: Product[] = data?.data ?? [];
  const count: number = data?.count ?? products.length;

  const setParam = (k: string, v?: string | null) => {
    const usp = new URLSearchParams(sp.toString());
    if (!v) usp.delete(k);
    else usp.set(k, v);
    router.replace(`?${usp.toString()}`, {scroll: false});
  };

  const toggleSize = (size: string) => {
    const usp = new URLSearchParams(sp.toString());
    const current = usp.getAll("sizes");
    const has = current.includes(size);
    usp.delete("sizes");
    (has ? current.filter((s) => s !== size) : [...current, size]).forEach(
      (s) => usp.append("sizes", s)
    );
    router.replace(`?${usp.toString()}`, {scroll: false});
  };

  return (
    <main className="container mx-auto  px-4 py-8">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold capitalize">{slug}</h1>
          <p className="text-sm text-neutral-500">
            All Products:{" "}
            <span className="font-medium text-neutral-800">{count}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-neutral-500">
            Sort by:
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setParam("sort", e.target.value)}
            className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10 cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>
        </div>
      </header>

      <section className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-600">Size:</span>
          <div className="flex flex-wrap gap-2">
            {ALL_SIZES.map((s) => {
              const active = sizes.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => toggleSize(s)}
                  className={`rounded-md border px-3 py-1.5 text-sm shadow-sm transition cursor-pointer ${
                    active
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-300 bg-white text-neutral-800 hover:border-neutral-400"
                  }`}
                  aria-pressed={active}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {isLoading && (
        <p className="text-sm text-neutral-500">Ładowanie produktów…</p>
      )}
      {error && <p className="text-sm text-red-600">Błąd wczytywania.</p>}
      {!isLoading && !error && products.length === 0 && (
        <p className="text-sm text-neutral-500">
          Brak produktów spełniających kryteria.
        </p>
      )}

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} showHeart={true} />
        ))}
      </section>
    </main>
  );
}
