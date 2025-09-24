// app/collections/[gender]/[slug]/page.tsx
import type {Metadata} from "next";

type Params = {params: Promise<{gender: string; slug: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {slug} = await params;
  const titles: Record<string, string> = {
    men: "Men’s Clothing – Tavros Online Store",
    women: "Women’s Clothing – Tavros Online Store",
    kids: "Kids’ Clothing – Tavros Online Store",
  };

  const descriptions: Record<string, string> = {
    men: "Shop Tavros men’s collection: stylish and comfortable clothing for every occasion. Free UK delivery from £50.",
    women:
      "Discover the Tavros women’s collection. Elegant, modern and comfortable clothing. Shop online with fast UK delivery.",
    kids: "Tavros kids’ collection. Trendy and comfy clothing for boys and girls. Free delivery on orders over £50.",
  };

  return {
    title: titles[slug] ?? `Collection ${slug} - Tavros`,
    description:
      descriptions[slug] ?? `Tavros Store – unique online collections.`,
    alternates: {canonical: `/collections/${slug}`},
    openGraph: {images: [`/og-${slug}.jpg`]},
  };
}

export default async function Page({params}: Params) {
  const {gender, slug} = await params; // server: await params
  return (
    // klientowy komponent z całą logiką SWR/filtrów
    <CollectionClient gender={gender} slug={slug} />
  );
}

// ważne: importuj PO definicjach żeby uniknąć cykli
import CollectionClient from "./CollectionClient";
