// app/api/collections/[slug]/products/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../../lib/mongodb";
import Product, { ProductDoc } from "../../../../../../models/Product";
import { FilterQuery } from "mongoose";


export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ gender: string; slug: string }> };
const ALLOWED = new Set(["MENS", "WOMENS", "KIDS"]);

export async function GET(req: Request, ctx: Ctx) {
  try {
    await connectToDatabase();
    const { gender: g, slug } = await ctx.params;
    const gender = g.toUpperCase();
    if (!ALLOWED.has(gender)) {
      return NextResponse.json({ ok: false, error: "Invalid gender" }, { status: 400 });
    }

    
    const { searchParams } = new URL(req.url);

    const sortKey = (searchParams.get("sort") ?? "newest") as
      | "newest" | "price_asc" | "price_desc";
    const sizes = searchParams.getAll("sizes");          // ?sizes=S&sizes=M
    const onlyInStock = searchParams.get("inStock") === "true";

    // Filtr bazowy po kolekcji
    const where: FilterQuery<ProductDoc> = { collectionSlug: slug, gender };
    // Filtr po rozmiarach (wariantach)
    if (sizes.length) {
      where["variants"] = { $elemMatch: { size: { $in: sizes } } };
    }

    // Dostępność: co najmniej jeden wariant ze stock > 0
    if (onlyInStock) {
      where["variants"] = where["variants"]
        ? { $elemMatch: { ...where["variants"].$elemMatch, stock: { $gt: 0 } } }
        : { $elemMatch: { stock: { $gt: 0 } } };
    }

    // Sortowanie
    const sortMap: Record<string, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
    };

    const items = await Product.find(where)
      .sort(sortMap[sortKey])
      .limit(200)
      .lean();

    return NextResponse.json({
      ok: true,
      data: items,
      count: items.length,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Błąd pobierania produktów" }, { status: 500 });
  }
}
