import {connectToDatabase} from "../../../lib/mongodb";
import Collection from "../../../models/Collection";

export async function GET(req: Request) {
  const {searchParams} = new URL(req.url);
  const gender = (searchParams.get("gender") || "MENS").toUpperCase();
  await connectToDatabase();

  const rows = await Collection.find({gender: {$in: [gender]}})
    .select("name slug heroImage sortOrder -_id")
    .sort({sortOrder: 1});

  const items = rows.map((r) => ({
    label: r.name,
    href: `/collections/${r.slug}`,
    img: r.heroImage,
  }));

  return Response.json({items});
}
