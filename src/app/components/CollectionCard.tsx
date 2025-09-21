import Image from "next/image";
import Link from "next/link";

export type CollectionCardProps = {
  label: string;
  href: string;
  img: string;
};

const CollectionCard = ({label, href, img}: CollectionCardProps) => {
  console.log("href",href);
  
  return (
    <Link
      href={href}
      className="group block w-full max-w-sm overflow-hidden rounded-lg"
    >
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={img}
          alt={label}
          fill
          sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="rounded bg-black/70 px-3 py-2 text-2xl font-extrabold uppercase tracking-wider text-white">
            {label}
          </span>
        </span>
      </div>
    </Link>
  );
};

export default CollectionCard;
