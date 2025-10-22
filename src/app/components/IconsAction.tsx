import {Heart, ShoppingBag, User} from "lucide-react";
import Link from "next/link";
import React, {useState} from "react";
import CartDrawer from "./CartDrawer";
import {useUserCart} from "../../lib/useUserCart";

const actions = [
  {href: "/account/myaccount", label: "My account", icon: User},
  {href: "/account/favorites", label: "Wishlist", icon: Heart},
];

const IconsAction = () => {
  const [open, setOpen] = useState(false);
  const {totalItems} = useUserCart();
  console.log("S", totalItems);

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
        aria-label="Open cart"
        className="relative grid h-9 w-9 place-items-center lg:h-12 lg:w-12"
      >
        <ShoppingBag className="h-6 w-6" />
        {totalItems > 0 && (
          <span
            aria-label={`${totalItems} items in cart`}
            className="absolute -right-1 -top-1 rounded-full bg-black px-1.5 text-[10px] font-semibold text-white lg:text-xs"
          >
            {totalItems}
          </span>
        )}
      </button>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default IconsAction;
