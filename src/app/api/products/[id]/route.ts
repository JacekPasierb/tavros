import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import { Types } from "mongoose";

type Ctx = { params: Promise<{ id: string }> };
export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: Ctx) {
  await connectToDatabase();
  const { id } = await ctx.params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
  }

  const doc = await Product.findById(id).lean();
  if (!doc) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true, data: doc });
}
