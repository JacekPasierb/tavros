// app/collections/[slug]/page.tsx
"use client";

import {use, useMemo} from "react";
import useSWR from "swr";
import {useRouter, useSearchParams} from "next/navigation";
import ProductCard, {Product} from "../../components/ProductCard";

type PageProps = {params: Promise<{slug: string}>};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

// Rozmiary, które chcesz obsługiwać w filtrze (dostosuj w razie potrzeby)
const ALL_SIZES = ["XS", "S", "M", "L", "XL"];

export default function CollectionPage({params}: PageProps) {
  const {slug} = use(params);
  const sp = useSearchParams();
  const router = useRouter();

  // --- odczyt filtrów z URL
  const sort = sp.get("sort") ?? "newest"; // "newest" | "price_asc" | "price_desc"
  const inStock = sp.get("inStock") === "true";
  const sizes = sp.getAll("sizes"); // wiele wartości: ?sizes=M&sizes=L

  // --- budowa URL do API (z filtrami)
  const apiUrl = useMemo(() => {
    const qs = new URLSearchParams();
    if (sort) qs.set("sort", sort);
    if (inStock) qs.set("inStock", "true");
    sizes.forEach((s) => qs.append("sizes", s));
    const qstr = qs.toString();
    return `/api/collections/${slug}/products${qstr ? `?${qstr}` : ""}`;
  }, [slug, sort, inStock, sizes]);

  // --- pobieranie
  const {data, error, isLoading} = useSWR(apiUrl, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  const products: Product[] = data?.data ?? [];
  const count: number = data?.meta?.total ?? data?.count ?? products.length;

  // --- helpery do modyfikacji URL (bez przeładowania)
  const setParam = (key: string, value?: string | null) => {
    const usp = new URLSearchParams(sp.toString());
    if (value === null || value === undefined || value === "") usp.delete(key);
    else usp.set(key, value);
    router.replace(`?${usp.toString()}`, {scroll: false});
  };

  const toggleSize = (size: string) => {
    const usp = new URLSearchParams(sp.toString());
    const current = usp.getAll("sizes");
    const has = current.includes(size);
    if (has) {
      // usuń jedną wartość
      const next = current.filter((s) => s !== size);
      usp.delete("sizes");
      next.forEach((s) => usp.append("sizes", s));
    } else {
      usp.append("sizes", size);
    }
    router.replace(`?${usp.toString()}`, {scroll: false});
  };

  const isSizeActive = (size: string) => sizes.includes(size);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight capitalize">
            {slug}
          </h1>
          <p className="text-sm text-neutral-500">
            All Products:{" "}
            <span className="font-medium text-neutral-800">{count}</span>
          </p>
        </div>

        {/* SORT */}
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

      {/* FILTRY: ROZMIAR + inStock */}
      <section className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-600">Size:</span>
          <div className="flex flex-wrap gap-2">
            {ALL_SIZES.map((s) => (
              <button
                key={s}
                onClick={() => toggleSize(s)}
                className={[
                  "rounded-md border px-3 py-1.5 text-sm shadow-sm transition cursor-pointer",
                  isSizeActive(s)
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 bg-white text-neutral-800 hover:border-neutral-400",
                ].join(" ")}
                aria-pressed={isSizeActive(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* STANY */}
      {isLoading && (
        <p className="text-sm text-neutral-500">Ładowanie produktów…</p>
      )}
      {error && (
        <p className="text-sm text-red-600">
          Błąd wczytywania. Spróbuj ponownie.
        </p>
      )}
      {!isLoading && !error && products.length === 0 && (
        <p className="text-sm text-neutral-500">
          Brak produktów spełniających kryteria.
        </p>
      )}

      {/* SIATKA KART */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </section>
    </main>
  );
}
