"use client";

import {useEffect, useMemo, useState} from "react";
import useSWR from "swr";
import {useSession} from "next-auth/react";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

function readGuestFavs(): string[] {
  try {
    const raw = localStorage.getItem("favorites");
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.map(String) : [];
  } catch {
    return [];
  }
}
function writeGuestFavs(next: string[]) {
  localStorage.setItem("favorites", JSON.stringify(Array.from(new Set(next))));
}

export function useFavorite(productId: string) {
  const {data: session} = useSession();
  const isLoggedIn = !!session;

  // Zalogowany: pobieramy listę z API, cache'ujemy SWR-em
  const {
    data,
    mutate,
    isLoading: swrLoading,
  } = useSWR(isLoggedIn ? "/api/favorites" : null, fetcher, {
    revalidateOnFocus: false,
  });

  // Gość: trzymamy listę w stanie i nasłuchujemy zmian w innych kartach
  const [guestFavs, setGuestFavs] = useState<string[]>([]);
  useEffect(() => {
    if (!isLoggedIn) {
      setGuestFavs(readGuestFavs());
      const onStorage = (e: StorageEvent) => {
        if (e.key === "favorites") setGuestFavs(readGuestFavs());
      };
      window.addEventListener("storage", onStorage);
      return () => window.removeEventListener("storage", onStorage);
    }
  }, [isLoggedIn]);

  const favIds: string[] = useMemo(() => {
    if (isLoggedIn) {
      const rows = Array.isArray(data?.data) ? data.data : [];
      return rows.map((p: {_id: string}) => String(p._id));
    }
    return guestFavs;
  }, [isLoggedIn, data, guestFavs]);

  const isFav = favIds.includes(productId);
  const loading = isLoggedIn ? swrLoading : false;

  // Akcje
  const add = async () => {
    if (isLoggedIn) {
      // optymistycznie zaktualizuj cache
      await mutate(
        (prev: {data?: {_id: string}[]}) => {
          const cur = Array.isArray(prev?.data) ? prev.data : [];
          if (cur.some((p: {_id: string}) => String(p._id) === productId))
            return prev;
          return {...prev, data: [...cur, {_id: productId}]};
        },
        {revalidate: false}
      );
      await fetch("/api/favorites", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({productId}),
      });
      mutate(); // sync z serwerem
    } else {
      writeGuestFavs([...guestFavs, productId]);
      setGuestFavs(readGuestFavs());
    }
  };

  const remove = async () => {
    if (isLoggedIn) {
      await mutate(
        (prev: {data?: {_id: string}[]}) => {
          const cur = Array.isArray(prev?.data) ? prev.data : [];
          return {
            ...prev,
            data: cur.filter((p: {_id: string}) => String(p._id) !== productId),
          };
        },
        {revalidate: false}
      );
      await fetch("/api/favorites", {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({productId}),
      });
      mutate();
    } else {
      writeGuestFavs(guestFavs.filter((id) => id !== productId));
      setGuestFavs(readGuestFavs());
    }
  };

  const toggle = async () => (isFav ? remove() : add());

  return {isFav, add, remove, toggle, loading, isLoggedIn};
}
