"use client";

import {Heart, Menu, Search, ShoppingBag} from "lucide-react";
import Link from "next/link";
import React, {useState} from "react";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="  sticky top-0 z-40 bg-white">
      <div className="container mx-auto grid grid-cols-[40px_1fr_auto] items-center gap-2   px-3 py-2 lg:grid-cols-[1fr_auto_1fr] text-black">
        {/* Hamburger */}
        <button
          className="grid h-9 w-9 place-items-center"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-drawer"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="justify-self-center text-[20px] tracking-[0.6em] text-zinc-900 lg:text-[22px]"
          aria-label="Brand home"
        >
          TAVROS
        </Link>

        {/* Right actions */}
        <nav
          className="flex gap-1 justify-self-end"
          aria-label="Header actions"
        >
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="grid h-9 w-9 place-items-center"
          >
            <Heart className="h-6 w-6" />
          </Link>
          <Link
            href="/search"
            aria-label="Search"
            className="grid h-9 w-9 place-items-center"
          >
            <Search className="h-6 w-6" />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="grid h-9 w-9 place-items-center"
          >
            <ShoppingBag className="h-6 w-6" />
          </Link>
        </nav>
        {/* Drawer */}
        <MobileMenu open={open} onClose={() => setOpen(false)} />
      </div>
    </header>
  );
};

export default Header;
