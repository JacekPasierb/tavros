// app/api/collections/[gender]/[slug]/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product, { ProductDoc } from "@/models/Product";
import type { FilterQuery } from "mongoose";

export const dynamic = "force-dynamic";

type Params = { gender: string; slug: string };
type Ctx = { params: Params } | { params: Promise<Params> };

const ALLOWED = new Set(["MENS", "WOMENS", "KIDS"]);

export async function GET(req: NextRequest, ctx: Ctx) {
  try {
    await connectToDatabase();

    // --- unifikacja params (może być obiektem albo Promise)
    const p: Params = "then" in ctx.params
      ? await (ctx as { params: Promise<Params> }).params
      : (ctx as { params: Params }).params;

    const gender = p.gender.toUpperCase();
    const slug = p.slug;

    if (!ALLOWED.has(gender)) {
      return NextResponse.json({ ok: false, error: "Invalid gender" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);

    // sort / filters
    const sortKey = (searchParams.get("sort") ?? "newest") as
      | "newest" | "price_asc" | "price_desc";
    const sizes = searchParams.getAll("sizes");
    const onlyInStock = searchParams.get("inStock") === "true";

    // pagination
    const rawLimit = Number.parseInt(searchParams.get("limit") ?? "", 10);
    const rawSkip  = Number.parseInt(searchParams.get("skip")  ?? "", 10);
    const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 200) : 200;
    const skip  = Number.isFinite(rawSkip)  ? Math.max(rawSkip, 0) : 0;

    // base filter
    const where: FilterQuery<ProductDoc> = { collectionSlug: slug, gender };

    if (sizes.length) {
      where.variants = { $elemMatch: { size: { $in: sizes } } };
    }

    if (onlyInStock) {
      where.variants = where.variants
        ? { $elemMatch: { ...(where.variants as { $elemMatch: { size?: { $in: string[] }; stock?: { $gt: number } } }).$elemMatch, stock: { $gt: 0 } } }
        : { $elemMatch: { stock: { $gt: 0 } } };
    }

    const sortMap: Record<typeof sortKey, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
    };

    const [items, total] = await Promise.all([
      Product.find(where).sort(sortMap[sortKey]).skip(skip).limit(limit).lean(),
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
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Błąd pobierania produktów" }, { status: 500 });
  }
}
