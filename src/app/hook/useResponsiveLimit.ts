// hooks/useResponsiveLimit.ts
"use client";
import { useEffect, useState } from "react";

export function useResponsiveLimit() {
  const [limit, setLimit] = useState<number | null>(null);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setLimit(w >= 1000 ? 3 : w >= 640 ? 2 : 1);
    };
    update(); // pierwszy odczyt
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return limit; // null na starcie → wstrzymamy SWR do pierwszego pomiaru
}
