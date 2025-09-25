import CollectionCard, {CollectionCardProps} from "./CollectionCard";
import TitleSection from "./TitleSection";

const CollectionsGrid = ({items}: {items: CollectionCardProps[]}) => {
  return (
    <div className="container mx-auto px-4  my-[25px]   md:my-[50px] lg:my-[100px]">
      <TitleSection title={"Shop by Collections"} />
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4 ">
        {items.map((c) => (
          <li key={c.href} className="w-full">
            <CollectionCard {...c} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CollectionsGrid;
