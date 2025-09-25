import {Heart, ShoppingBag, User} from "lucide-react";
import Link from "next/link";
import React from "react";

const actions = [
    { href: "/account/myaccount", label: "My account", icon: User },
    { href: "/account/favorites", label: "Wishlist", icon: Heart },
    { href: "/cart", label: "Cart", icon: ShoppingBag },
  ];

const IconsAction = () => {
  return (
     <ul className="flex gap-1 justify-self-end md:gap-4" aria-label="Header actions">
      {actions.map(({ href, label, icon: Icon }) => (
        <li key={href}>
          <Link href={href} aria-label={label} className="grid h-9 w-9 place-items-center lg:h-12 lg:w-12">
            <Icon className="h-6 w-6" />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default IconsAction;
