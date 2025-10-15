import {NextRequest, NextResponse} from "next/server";
import {connectToDatabase} from "@/lib/mongodb";
import Product from "@/models/Product";
import {FilterQuery} from "mongoose";
import {ProductDoc} from "../../../models/Product";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const sp = req.nextUrl.searchParams;

    const gender = (sp.get("gender") || "").toUpperCase();
    const collection = sp.get("collection") || undefined;
    const sortKey =
      (sp.get("sort") as "newest" | "price_asc" | "price_desc") || "newest";
    const sizes = sp.getAll("sizes"); // ["M","L"]
    const inStockParam = sp.get("inStock") === "true";

    const rawLimit = parseInt(sp.get("limit") ?? "", 10);
    const rawSkip  = parseInt(sp.get("skip")  ?? "", 10);
    const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 50) : 12;
    const skip  = Number.isFinite(rawSkip)  ? Math.max(rawSkip, 0)              : 0;

    // --- filtr
    const where: FilterQuery<ProductDoc> = {};
    if (gender) where.gender = gender;
    if (collection) where.collectionSlug = collection;

    const mustBeInStock = inStockParam || sizes.length > 0;

    // --- filtrowanie po rozmiarach i dostępności
    if (sizes.length > 0 || mustBeInStock) {
      const elem: {
        size?: {$in: string[]};
        stock?: {$nin: (string | number | null | undefined)[]};
      } = {};
      if (sizes.length > 0) elem.size = {$in: sizes};
      // działa dla stock jako number **i** string
      if (mustBeInStock) elem.stock = {$nin: [0, "0", null, undefined]};
      where.variants = {$elemMatch: elem};
    }

    // --- sortowanie
    const sortMap = {
      newest: {createdAt: -1},
      price_asc: {price: 1},
      price_desc: {price: -1},
    } as const;

     const [items, total] = await Promise.all([
      Product.find(where)
        .sort(sortMap[sortKey])
        .skip(skip)
        .limit(limit)
        .select("title slug price images gender collectionSlug variants")
        .lean(),
      Product.countDocuments(where),
    ]);

    return NextResponse.json({
      ok: true,
      data: items,
      count: items.length,
      total,
      skip,
      limit,
      hasMore: skip + items.length < total,
    });
  } catch (err) {
    console.error("[GET /api/products]", err);
    return NextResponse.json(
      {ok: false, error: "Błąd pobierania produktów"},
      {status: 500}
    );
  }
}
