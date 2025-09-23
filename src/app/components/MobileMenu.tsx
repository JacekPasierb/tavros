"use client";

import Image from "next/image";
import Link from "next/link";
import {X, ChevronRight} from "lucide-react";
import {useEffect, useState} from "react";

type MobileMenuProps = {open: boolean; onClose: () => void};

type PanelItem = {
  label: string;
  href?: string;
  children?: {label: string; href: string}[];
  special?: boolean;
};

const PANELS: Record<"MENS" | "WOMENS" | "KIDS", PanelItem[]> = {
  MENS: [
    {label: "New In", href: "/collections/mens-new", special: true},
    {label: "Shop All", href: "/men/all"},
    {label: "Best Sellers", href: "/men/best"},
    {label: "Sale", href: "/men/sale"},
    {
      label: "Shop By Category",
      children: [
        {label: "T-Shirts", href: "/men/tshirts"},
        {label: "Hoodies", href: "/men/hoodies"},
        {label: "Bottoms", href: "/men/bottoms"},
        {label: "Shoes", href: "/men/shoes"},
      ],
    },
    {
      label: "Shop By Collection",
      children: [
        {label: "Core", href: "/men/collection/core"},
        {label: "Athleisure", href: "/men/collection/athleisure"},
      ],
    },
  ],
  WOMENS: [
    {label: "New In", href: "/collections/womens-new", special: true},
    {label: "Shop All", href: "/women/all"},
    {label: "Best Sellers", href: "/women/best"},
    {label: "Sale", href: "/women/sale"},
    {
      label: "Shop By Category",
      children: [
        {label: "Tops", href: "/women/tops"},
        {label: "Leggings", href: "/women/leggings"},
        {label: "Outerwear", href: "/women/outerwear"},
      ],
    },
    {
      label: "Shop By Collection",
      children: [
        {label: "Core", href: "/women/collection/core"},
        {label: "Lifestyle", href: "/women/collection/lifestyle"},
      ],
    },
  ],
  KIDS: [
    {label: "Shop All", href: "/kids/all"},
    {label: "Sale", href: "/kids/sale"},
    {
      label: "Shop By Category",
      children: [
        {label: "T-Shirts", href: "/kids/tshirts"},
        {label: "Hoodies", href: "/kids/hoodies"},
      ],
    },
  ],
};

const accent = "emerald-600"; // łatwo zmienisz motyw koloru

export default function MobileMenu({open, onClose}: MobileMenuProps) {
  const [tab, setTab] = useState<"MENS" | "WOMENS" | "KIDS">("MENS");
  const [expanded, setExpanded] = useState<string | null>(null);

  // blokada scrolla body gdy menu otwarte
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", open);
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  const toggleSection = (label: string) =>
    setExpanded((prev) => (prev === label ? null : label));

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[92vw] max-w-[420px] bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col">
          {/* TOP */}
          <div className="flex-none border-b px-4 pt-3 pb-2">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex gap-5 text-sm font-semibold uppercase tracking-wide">
                {(["MENS", "WOMENS", "KIDS"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`pb-2 transition-colors ${
                      tab === t
                        ? `border-b-2 border-${accent} text-black`
                        : "text-zinc-500 hover:text-black"
                    }`}
                    aria-pressed={tab === t}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <button
                aria-label="Close menu"
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-full border border-zinc-200 hover:bg-zinc-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* search */}
            {/* <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="search"
                placeholder="Search products…"
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-zinc-300"
              />
            </label> */}
          </div>

          {/* MIDDLE (scroll) */}
          <div className="flex-1 overflow-y-auto px-3 py-3">
            <ul className="space-y-3">
              {PANELS[tab].map((it) => (
                <li key={it.label}>
                  {it.children ? (
                    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
                      <button
                        className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-[15px] font-medium"
                        onClick={() => toggleSection(it.label)}
                      >
                        <span>{it.label}</span>
                        <ChevronRight
                          className={`h-5 w-5 shrink-0 transition-transform ${
                            expanded === it.label ? "rotate-90" : ""
                          }`}
                        />
                      </button>
                      {expanded === it.label && (
                        <ul className="px-2 pb-2">
                          {it.children.map((c) => (
                            <li key={c.href}>
                              <Link
                                href={c.href}
                                onClick={onClose}
                                className="block rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                              >
                                {c.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={it.href || "#"}
                      onClick={onClose}
                      className={`block rounded-xl border border-zinc-200 px-4 py-3 text-[15px] font-medium shadow-sm transition hover:shadow ${
                        it.special
                          ? "bg-gradient-to-r from-black to-zinc-800 text-white"
                          : "bg-white"
                      }`}
                    >
                      {it.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* BOTTOM – elegancka stopka */}
          <div
            className="flex-none border-t bg-zinc-50/60 px-5 py-5"
            style={{
              paddingBottom: "calc(env(safe-area-inset-bottom,0px)+0.75rem)",
            }}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              {/* brand */}
              <div className="space-y-1">
                <p className="text-xs tracking-[0.25em] text-zinc-500">
                  TAVROS
                </p>
                <Image
                  src="/icons/logo.svg" // podmień na swoje logo
                  alt="Brand logo"
                  width={120}
                  height={40}
                  className="h-auto w-32 object-contain"
                />
              </div>

              {/* CTA */}
              <div className="grid w-full grid-cols-2 gap-3">
                <Link
                  href="/account/register"
                  onClick={onClose}
                  className="rounded-full border border-zinc-300 bg-white py-2 text-sm font-medium hover:border-zinc-400 hover:shadow-sm"
                >
                  Create Account
                </Link>
                <Link
                  href="/account/signin"
                  onClick={onClose}
                  className="rounded-full bg-black py-2 text-sm font-semibold text-white hover:bg-zinc-900"
                >
                  Log in
                </Link>
              </div>

              {/* micro-copy */}
              <p className="text-[11px] leading-snug text-zinc-500">
                Save favourites, track orders & checkout faster.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
