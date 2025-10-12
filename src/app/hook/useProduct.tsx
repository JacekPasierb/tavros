import useSWR from "swr";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useUserFavorites } from "@/lib/useUserFavorites";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useMemo, useState } from "react";

const fetcher = async (url: string) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error("Failed to fetch product");
  return r.json();
};

export function useProduct() {
  const { slug } = useParams<{ slug: string }>();
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  const { data, error, isLoading } = useSWR(
    slug ? `/api/products/${slug}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const product = data?.data;
  const productId = product?._id;

  // favorites logic
  const {
    ids: serverFavIds,
    add,
    remove,
    isLoading: favsLoading,
  } = useUserFavorites();
  const isFavUser = useMemo(
    () => (productId ? serverFavIds?.has(productId) ?? false : false),
    [serverFavIds, productId]
  );

  const isFavGuest = useFavoritesStore((s) =>
    productId ? s.isFavorite(productId) : false
  );
  const toggleGuest = useFavoritesStore((s) => s.toggle);

  const [busy, setBusy] = useState(false);
  const disabled = busy || (isLoggedIn && favsLoading);
  const fav = isLoggedIn ? isFavUser : isFavGuest;

  async function toggleFavorite() {
    if (disabled || !productId) return;

    if (!isLoggedIn) {
      toggleGuest(productId);
      return;
    }
    try {
      setBusy(true);
      if (isFavUser) await remove(productId);
      else await add(productId);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  return { product, isLoading, error, fav, disabled, toggleFavorite };
}
