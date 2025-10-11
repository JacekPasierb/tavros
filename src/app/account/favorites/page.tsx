"use client";

import {useSession} from "next-auth/react";
import useSWR from "swr";
import {useMemo} from "react";
import ProductCard, {Product} from "@/app/components/ProductCard";
import {useUserFavorites} from "@/lib/useUserFavorites"; // Twój hook do API
import {useFavoritesStore} from "@/store/favoritesStore"; // Twój store

const fetcher = async (url: string) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
};

const FavoritesPage = () => {
  const {status} = useSession();
  const isLoggedIn = status === "authenticated";

  // -------- zalogowany (Mongo przez API) --------
  const {
    products: userProducts,
    remove: removeServer,
    isLoading: userLoading,
  } = useUserFavorites();

  // -------- gość (Zustand IDs -> fetch szczegółów) --------

  const favoritesMap = useFavoritesStore((s) => s.favorites); // stabilny slice
  const guestIds = useMemo(() => Object.keys(favoritesMap), [favoritesMap]);

  const removeGuest = useFavoritesStore((s) => s.remove);
  const clearGuest = useFavoritesStore((s) => s.clear);

  const guestKey =
    !isLoggedIn && guestIds.length
      ? `/api/products?ids=${encodeURIComponent(guestIds.join(","))}`
      : null;

  const {data: guestData, isLoading: guestLoading} = useSWR(guestKey, fetcher, {
    revalidateOnFocus: false,
  });

  // -------- wspólny widok --------
  const loading =
    status === "loading" || (isLoggedIn ? userLoading : guestLoading);

  const products: Product[] = useMemo(
    () => {
      if (isLoggedIn) return userProducts as Product[];
      return (guestData?.data as Product[]) ?? [];
    },
    [isLoggedIn, userProducts, guestData?.data]
  );

  const handleRemove = async (id: string) => {
    if (isLoggedIn) {
      await removeServer(id); // hook odświeży listę przez mutate
    } else {
      removeGuest(id); // usunięcie z Zustand
      // SWR sam zareaguje, bo zmieni się guestIds -> key; jeśli chcesz natychmiast
      // odświeżyć, możesz dodać lokalne mutate(guestKey), ale zwykle nie trzeba.
    }
  };

  if (loading)
    return <main className="container mx-auto px-4 py-8">Loading…</main>;

  return (
    <main className="container mx-auto px-4 py-8 text-center">
      <h2 className="mb-2 text-2xl font-semibold uppercase">My Wishlist</h2>

      <p className="mb-6 text-sm text-zinc-500">
        All Products: {products.length}
      </p>

      {!isLoggedIn && (
        <div className="mb-6 flex items-center justify-between gap-3">
          <p className="text-sm text-zinc-500">
          Your favourite products are saved only in this browser. Create a free
          Tavros account to keep your favourites safe across all devices and
          never lose them.
          </p>
          {guestIds.length > 0 && (
            <button
              onClick={clearGuest}
              className="rounded bg-neutral-200 px-3 py-1 text-sm hover:bg-neutral-300"
              aria-label="Clear wishlist"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {products.length === 0 && (
        <div className="mt-8 flex flex-col items-center justify-center  border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center shadow-sm">
        <h3 className="mb-2 text-lg font-semibold text-zinc-800">
          Your wishlist is empty 🖤
        </h3>
        <p className="mb-6 max-w-md text-sm text-zinc-600">
          Looks like you haven’t added any products to your favourites yet.
          Browse our collections and tap the{" "}
          <span className="inline-flex items-center justify-center rounded-full bg-white px-1 py-0.5 text-red-500 shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
              4.42 3 7.5 3c1.74 0 3.41 0.81 
              4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 
              3 22 5.42 22 8.5c0 3.78-3.4 
              6.86-8.55 11.54L12 21.35z" />
            </svg>
          </span>{" "}
          icon to start saving your favourite items!
        </p>
    
        {/* <a
          href="/shop"
          className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white shadow-md transition hover:bg-neutral-800"
        >
          Discover products
        </a> */}
      </div>
      )}

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            showHeart={false}
            onRemoved={handleRemove}
          />
        ))}
      </section>
    </main>
  );
};
export default FavoritesPage;
