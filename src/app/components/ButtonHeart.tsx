import { Heart } from "lucide-react";

type Props = {
  fav: boolean;
  toggle: () => void;
  disabled?: boolean;
};

export default function ButtonHeart({ fav, toggle, disabled }: Props) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      disabled={disabled}
      className="rounded-full bg-white/80 p-2 shadow hover:bg-white disabled:opacity-60"
      aria-label={fav ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={fav}
      title={fav ? "In wishlist" : "Add to wishlist"}
    >
      <Heart
        className={`h-6 w-6 ${
          fav ? "fill-red-500 text-red-500" : "text-zinc-700"
        }`}
      />
    </button>
  );
}
