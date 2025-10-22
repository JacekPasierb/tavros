// lib/useUserCart.ts
"use client";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { useCartStore, type CartItem } from "@/store/cartStore";
import { useState } from "react";

// Jeśli chcesz lepszą obsługę błędów:
const fetcher = async (url: string) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
};

// Element z kluczem wariantu:
export type CartLine = CartItem & { key: string };

export function useUserCart() {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  // Zustand (gość)
  const {
    getItems: getGuestItems,
    add: addGuest,
    remove: removeGuest,      // (key: string)
    update: updateGuest,      // (key: string, qty: number)
    clear: clearGuest,
    getSubtotal: getGuestSubtotal,
    getTotalItems: getGuestTotalItems,
  } = useCartStore();

  // SWR (zalogowany)
  const { data, mutate, isLoading } = useSWR(
    isLoggedIn ? "/api/cart" : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const [isLoadingAction, setIsLoadingAction] = useState(false);

  // --- Dodawanie ---
  const addItem = async (item: CartItem) => {
    if (!isLoggedIn) {
      addGuest(item); // store wyliczy key sam (makeKey)
      return;
    }
    try {
      setIsLoadingAction(true);
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // backend może sam policzyć key, ale można też dodać tutaj: key: `${_id}::${size||sku||nosize}`
        body: JSON.stringify({ item }),
      });
      if (!res.ok) throw new Error(await res.text());
      await mutate();
    } catch (e) {
      console.error("Error adding item:", e);
    } finally {
      setIsLoadingAction(false);
    }
  };

  // --- Usuwanie po kluczu wariantu ---
  const removeItem = async (key: string) => {
    if (!isLoggedIn) {
      removeGuest(key);
      return;
    }
    try {
      setIsLoadingAction(true);
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }), // ⬅️ ważne
      });
      if (!res.ok) throw new Error(await res.text());
      await mutate();
    } catch (e) {
      console.error("Error removing item:", e);
    } finally {
      setIsLoadingAction(false);
    }
  };

  // --- Aktualizacja ilości po kluczu wariantu ---
  const updateItem = async (key: string, qty: number) => {
    if (!isLoggedIn) {
      updateGuest(key, qty);
      return;
    }
    try {
      setIsLoadingAction(true);
      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, qty }), // ⬅️ używamy argumentów funkcji
      });
      if (!res.ok) throw new Error(await res.text());
      await mutate();
    } catch (e) {
      console.error("Error updating item:", e);
    } finally {
      setIsLoadingAction(false);
    }
  };

  // --- Czyszczenie ---
  const clearCart = async () => {
    if (!isLoggedIn) {
      clearGuest();
      return;
    }
    try {
      setIsLoadingAction(true);
      const items: CartLine[] = Array.isArray(data?.items) ? data.items : [];
      // usuwamy po kluczach wariantów
      await Promise.all(
        items.map((it) =>
          fetch("/api/cart", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: it.key }),
          })
        )
      );
      await mutate();
    } catch (e) {
      console.error("Error clearing cart:", e);
    } finally {
      setIsLoadingAction(false);
    }
  };

  // --- Zwracane dane ---
  const items: CartLine[] = isLoggedIn
    ? (Array.isArray(data?.items) ? data.items : [])
    : (getGuestItems() as CartLine[]); // store.getItems() już zwraca z key

  const subtotal = isLoggedIn ? data?.subtotal ?? 0 : getGuestSubtotal();

  const totalItems = isLoggedIn
    ? (Array.isArray(data?.items)
        ? (data.items as CartLine[]).reduce((s, it) => s + (it.qty || 0), 0)
        : 0)
    : getGuestTotalItems();

  return {
    items,
    subtotal,
    totalItems,
    addItem,
    removeItem,  // (key)
    updateItem,  // (key, qty)
    clearCart,
    isLoading: isLoading || isLoadingAction,
    isLoggedIn,
  };
}
