"use client";
type Tab = "MENS" | "WOMENS" | "KIDS";

const CategoryTabs = ({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
}) => {
  return (
    <div
      className={`sticky top-14 z-30 border-b bg-white backdrop-blur md:top-18`}
    >
      <div className="container mx-auto  py-4">
        <ul className="flex justify-center gap-6 py-3 text-lg font-semibold uppercase md:gap-8 lg:text-[25px]">
          {(["MENS", "WOMENS", "KIDS"] as const).map((t) => (
            <li key={t}>
              <button
                onClick={() => onChange(t)}
                className={` transition-colors ${
                  active === t
                    ? "border-b-2 border-black"
                    : "text-zinc-500 hover:text-black"
                } cursor-pointer`}
                aria-pressed={active === t}
              >
                {t}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryTabs;
