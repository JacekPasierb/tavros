"use client";
type Tab = "MENS" | "WOMENS";

const CategoryTabs = ({
  active,
  onChange,
  top = "top-12",
}: {
  active: Tab;
  onChange: (t: Tab) => void;
  top?: string;
}) => {
  return (
    <div className={`sticky ${top} z-30 border-b bg-white/90 backdrop-blur`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-center gap-6 py-3 text-lg font-semibold uppercase">
          {(["MENS", "WOMENS"] as const).map((t) => (
            <button
              key={t}
              onClick={() => onChange(t)}
              className={`pb-2 transition-colors ${
                active === t
                  ? "border-b-2 border-black"
                  : "text-zinc-500 hover:text-black"
              }`}
              aria-pressed={active === t}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;
