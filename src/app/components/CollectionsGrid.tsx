import CollectionCard, {CollectionCardProps} from "./CollectionCard";

const CollectionsGrid = ({items}: {items: CollectionCardProps[]}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="mb-6 text-center text-sm font-extrabold tracking-[0.25em] uppercase">
        Shop by Collections
      </h2>

      <div className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((c) => (
          <CollectionCard key={c.href} {...c} />
        ))}
      </div>
    </div>
  );
};

export default CollectionsGrid;
