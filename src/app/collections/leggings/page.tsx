import React from "react";
import ProductCard from "../../components/ProductCard";
import {DATA} from "../../data/data";

const page = () => {
  const {recommended} = DATA["WOMENS"];

  return (
    <section className="container mx-auto py-10">
      <h2 className="text-center font-bold">Women Leggings</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {recommended.map((item, index) => (
          <ProductCard key={index} {...item} />
        ))}
      </div>
    </section>
  );
};

export default page;
