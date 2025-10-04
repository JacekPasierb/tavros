import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import { Types } from "mongoose";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get("ids"); // "id1,id2,id3"
    if (!idsParam) return NextResponse.json({ ok: true, data: [], count: 0 });

    // parse + walidacja ObjectId
    const rawIds = idsParam.split(",").map((s) => s.trim()).filter(Boolean);
    const ids = rawIds
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));

    if (ids.length === 0) return NextResponse.json({ ok: true, data: [], count: 0 });
console.log(ids);

    // pobierz tylko potrzebne pola
    const rows = await Product.find(
      { _id: { $in: ids } },
      { title: 1, price: 1, images: 1, slug: 1, currency: 1, collectionSlug: 1 }
    ).lean();

    // zachowaj kolejność jak w `ids`
    const pos = new Map(ids.map((id, i) => [id.toString(), i]));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rows.sort((a: any, b: any) => (pos.get(a._id.toString()) ?? 0) - (pos.get(b._id.toString()) ?? 0));

    return NextResponse.json({ ok: true, data: rows, count: rows.length });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Failed to fetch products by ids" }, { status: 500 });
  }
}
