import Image from "next/image";
import Link from "next/link";

export type CollectionCardProps = {
  label: string;
  href: string;
  img: string;
};

const CollectionCard = ({label, href, img}: CollectionCardProps) => {
  return (
    <Link href={href} className="group block w-full mx-auto overflow-hidden">
      <div className="relative aspect-[6/6] w-full">
        <Image
          src={img}
          alt={label}
          fill
          sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
          className="object-fill transition-transform duration-300 group-hover:scale-105"
        />
        {/* overlay */}
        <span className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="rounded  px-3 py-2 text-[13px] font-extrabold uppercase tracking-wider text-black md:text-[25px] lg:text-[18px]">
            {label}
          </span>
        </span>
      </div>
    </Link>
  );
};

export default CollectionCard;
