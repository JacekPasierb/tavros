// app/api/collections/route.ts
import {NextRequest, NextResponse} from "next/server";
import {connectToDatabase} from "@/lib/mongodb";
import Collection, {type CollectionDoc} from "@/models/Collection";
import type {FilterQuery} from "mongoose";

const ALLOWED = new Set(["MENS", "WOMENS", "KIDS"]);

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const {searchParams} = req.nextUrl;

    const rawGender = searchParams.get("gender");
    const gender = rawGender ? rawGender.toUpperCase() : undefined;

    if (gender && !ALLOWED.has(gender)) {
      return NextResponse.json({error: "Invalid gender"}, {status: 400});
    }

    // opcjonalny limit (domyślnie bez limitu)
    const limitParam = searchParams.get("limit");
    const limit = limitParam
      ? Math.min(Math.max(parseInt(limitParam, 10) || 0, 1), 200)
      : 0;

    const where: FilterQuery<CollectionDoc> = {};
    if (gender) where.gender = gender;

    // UWAGA: projekcja zawiera `gender`, żeby poprawnie zbudować href
    const rows = await Collection.find(where, {
      _id: 0,
      name: 1,
      slug: 1,
      heroImage: 1,
      sortOrder: 1,
      gender: 1,
    })
      .sort({sortOrder: 1})
      .limit(limit)
      .lean();

    const items = rows.map((r) => ({
      label: r.name,
      href: `/collections/${gender}/${r.slug}`,
      img: r.heroImage,
    }));

    return NextResponse.json(
      {items},
      {
        headers: {
          // standardowy cache kill:
          "Cache-Control": "private, no-store, no-cache, max-age=0, must-revalidate",
          // (opcjonalnie dla Netlify CDN - działa lepiej)
          "Netlify-CDN-Cache-Control": "no-cache",
        },
      }
    );
  } catch (err) {
    console.error("[GET /api/collections]", err);
    return NextResponse.json({error: "Server error"}, {status: 500});
  }
}
