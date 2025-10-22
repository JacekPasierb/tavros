import {Heart, ShoppingBag, User} from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import CartDrawer from "./CartDrawer";

const actions = [
  {href: "/account/myaccount", label: "My account", icon: User},
  {href: "/account/favorites", label: "Wishlist", icon: Heart},
];

const IconsAction = () => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    // przyklad danych
    { _id: "1", title: "Hoodie Black", price: 199, qty: 1, image: "/img1.webp", slug: "hoodie-black" },
  ]);

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.price * i.qty, 0),
    [items]
  );

  const inc = (id: string) =>
    setItems((arr) =>
      arr.map((x) => (x._id === id ? { ...x, qty: x.qty + 1 } : x))
    );
  const dec = (id: string) =>
    setItems((arr) =>
      arr.map((x) =>
        x._id === id ? { ...x, qty: Math.max(1, x.qty - 1) } : x
      )
    );
  const remove = (id: string) =>
    setItems((arr) => arr.filter((x) => x._id !== id));

  return (
    <div className="flex gap-1 justify-self-end md:gap-4">
      <ul
        className="flex gap-1 justify-self-end md:gap-4"
        aria-label="Header actions"
      >
        {actions.map(({href, label, icon: Icon}) => (
          <li key={href}>
            <Link
              href={href}
              aria-label={label}
              className="grid h-9 w-9 place-items-center lg:h-12 lg:w-12"
            >
              <Icon className="h-6 w-6" />
            </Link>
          </li>
        ))}
      </ul>
      <button
        onClick={() => setOpen(true)}
        className="relative   bg-white px-4 py-2 text-sm font-medium hover:cursor-pointer"
      >
        <ShoppingBag />
      </button>
      <CartDrawer
        open={open}
        onClose={() => setOpen(false)}
        items={items}
        subtotal={subtotal}
        onInc={inc}
        onDec={dec}
        onRemove={remove}
      />
    </div>
  );
};

export default IconsAction;
