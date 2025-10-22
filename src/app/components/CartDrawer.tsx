"use client";

import {useEffect, useRef} from "react";
import {createPortal} from "react-dom";
import {motion, AnimatePresence} from "framer-motion";
import {X} from "lucide-react";
import Image from "next/image";
import {useUserCart} from "@/lib/useUserCart";
import type {CartItem} from "@/store/cartStore";

type CartLine = CartItem & {key: string};

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const {items, subtotal, updateItem, removeItem, isLoading} = useUserCart();
  const initialFocusRef = useRef<HTMLButtonElement>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      lastActiveRef.current = document.activeElement as HTMLElement;
      document.body.classList.add("overflow-hidden");
      setTimeout(() => initialFocusRef.current?.focus(), 0);
    } else {
      document.body.classList.remove("overflow-hidden");
      lastActiveRef.current?.focus?.();
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{x: "100%"}}
            animate={{x: 0}}
            exit={{x: "100%"}}
            transition={{type: "spring", stiffness: 300, damping: 30}}
            className="fixed inset-y-0 right-0 left-auto z-50 w-[92vw] max-w-[420px] bg-white shadow-2xl grid grid-rows-[auto_1fr_auto]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-lg font-semibold">Your Cart</h2>
              <button
                ref={initialFocusRef}
                onClick={onClose}
                aria-label="Close cart"
                className="grid h-9 w-9 place-items-center rounded-full border border-zinc-200 hover:bg-zinc-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="overflow-y-auto p-3 space-y-3">
              {!items || items.length === 0 ? (
                <EmptyState />
              ) : (
                items.map((it: CartLine) => {
                  const imgSrc =
                    // prefer single image
                    it.image ||
                    // or first from images array
                    (Array.isArray(it.images) ? it.images[0] : undefined) ||
                    // or heroImage
                    it.heroImage ||
                    // fallback
                    "/placeholder.webp";

                  const mapKey =
                    it.key || `${it._id ?? it.title}-${it.size ?? "nosize"}`;

                  return (
                    <div
                      key={mapKey}
                      className="flex gap-3 rounded-xl border border-zinc-200 p-3"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                        <Image
                          src={imgSrc}
                          alt={it.title}
                          width={64}
                          height={64}
                          sizes="64px"
                          className="h-full w-full object-cover"
                          // jeśli używasz zewn. domen, pamiętaj o dopisaniu jej w next.config.js -> images.domains
                          onError={() => {}}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {it.title}
                        </p>
                        {it.size && (
                          <p className="text-xs text-zinc-400">
                            Size: {it.size}
                          </p>
                        )}
                        <p className="text-sm text-zinc-500">
                          {Intl.NumberFormat("en-GB", {
                            style: "currency",
                            currency: "GBP",
                          }).format(it.price)}
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateItem((it as CartLine).key, it.qty - 1)
                            }
                            disabled={isLoading}
                            className="h-7 w-7 rounded border text-sm disabled:opacity-50"
                          >
                            –
                          </button>
                          <span className="w-6 text-center text-sm">
                            {it.qty}
                          </span>
                          <button
                            onClick={() =>
                              updateItem((it as CartLine).key, it.qty + 1)
                            }
                            disabled={isLoading}
                            className="h-7 w-7 rounded border text-sm disabled:opacity-50"
                          >
                            +
                          </button>

                          <button
                            onClick={() => removeItem((it as CartLine).key)}
                            disabled={isLoading}
                            className="ml-auto text-xs text-zinc-500 hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="border-t p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-medium">
                  {Intl.NumberFormat("en-GB", {
                    style: "currency",
                    currency: "GBP",
                  }).format(subtotal ?? 0)}
                </span>
              </div>
              <button
                disabled={!items?.length}
                className="w-full rounded-full bg-black py-2 text-sm font-semibold text-white shadow transition hover:bg-zinc-900 disabled:opacity-50"
                onClick={() => (window.location.href = "/checkout")}
              >
                Go to checkout
              </button>
              <button
                onClick={onClose}
                className="w-full rounded-full border border-zinc-300 bg-white py-2 text-sm font-medium hover:border-zinc-400"
              >
                Continue shopping
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
      <p className="mb-2 text-sm font-medium text-zinc-800">
        Your cart is empty
      </p>
      <p className="text-xs text-zinc-500">
        Start adding items to see them here.
      </p>
    </div>
  );
}
