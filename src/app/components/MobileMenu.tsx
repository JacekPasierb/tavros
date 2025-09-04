"use client";

import Image from "next/image";
import Link from "next/link";
import {X, ChevronRight} from "lucide-react";
import {useState} from "react";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

type PanelItem = {
  label: string;
  href?: string;
  children?: {label: string; href: string}[];
  special?: boolean;
};

const PANELS: Record<"MENS" | "WOMENS" | "KIDS", PanelItem[]> = {
  MENS: [
    {label: "New In", href: "/men/new", special: true},
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
    {label: "New In", href: "/women/new", special: true},
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

export default function MobileMenu({open, onClose}: MobileMenuProps) {
  const [tab, setTab] = useState<"MENS" | "WOMENS" | "KIDS">("MENS");
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleSection = (label: string) =>
    setExpanded((prev) => (prev === label ? null : label));

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden
          ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[92vw] max-w-[420px] bg-white shadow-xl transition-transform duration-200
        ${open ? "translate-x-0" : "-translate-x-full"}`}
        aria-hidden={!open}
      >
        {/* Top bar with tabs + close */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex gap-6 text-sm font-semibold uppercase">
            {(["MENS", "WOMENS", "KIDS"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-2 ${
                  tab === t ? "border-b-2 border-black" : "text-zinc-500"
                } `}
                aria-pressed={tab === t}
              >
                {t}
              </button>
            ))}
          </div>
          <button aria-label="Close menu" onClick={onClose}>
            <X className="h-6 w-6 text-black" />
          </button>
        </div>

        {/* Panel content */}
        <div className="overflow-y-auto pb-6 ">
          <ul className="">
            {PANELS[tab].map((it) => (
              <li key={it.label} className="border-b">
                {it.children ? (
                  <div className="px-4 ">
                    <button
                      className="flex w-full items-center justify-between py-4 text-[15px] font-medium "
                      onClick={() => toggleSection(it.label)}
                    >
                      {it.label}
                      <ChevronRight
                        className={`h-5 w-5 transition-transform ${
                          expanded === it.label ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    {expanded === it.label && (
                      <ul className="mb-2 pl-2">
                        {it.children.map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              className="block rounded-md px-2 py-2 text-sm hover:bg-zinc-100 "
                              onClick={onClose}
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
                    className={`flex items-center justify-between px-4 py-4 text-[15px] font-medium hover:opacity-80 ${
                      it.special ? "bg-black text-white" : ""
                    }`}
                    onClick={onClose}
                  >
                    {it.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Two promo tiles */}
          <div className="mt-4 grid grid-cols-2 gap-2 px-4 justify-items-center">
            <Image
              src="/placeholder.png"
              width={100}
              height={100}
              alt="Loyalty Club"
              className="object-cover"
            />

            <Image
              width={100}
              height={100}
              src="/placeholder.png"
              alt="Brand Hub"
              className="object-cover"
            />
          </div>

          {/* Account footer */}
          <div className="mt-4 border-t px-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold tracking-wide">
                MY ACCOUNT
              </span>
              <div className="flex gap-4 text-sm">
                <Link
                  href="/register"
                  onClick={onClose}
                  className="hover:underline"
                >
                  Create Account
                </Link>
                <Link
                  href="/login"
                  onClick={onClose}
                  className="hover:underline"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
