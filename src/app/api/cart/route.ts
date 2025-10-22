// app/api/cart/route.ts
import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth/next";
import {authOptions} from "../auth/[...nextauth]/route";
import {connectToDatabase} from "@/lib/mongodb";
import User from "@/models/User";

const makeKey = (x: {_id: unknown; size?: string; sku?: string}) =>
  `${String(x._id)}_${x.sku ?? x.size ?? "nosize"}`;

export type CartItemDoc = {
  _id: unknown; // ⬅ uogólnione
  title?: string;
  price?: number | string;
  qty?: number | string;
  size?: string;
  sku?: string;
  image?: string;
  images?: string[];
  heroImage?: string;
  key?: string;
  toObject?: () => Record<string, unknown>;
};

type CartItem = {
  _id: string;
  key: string;
  price: number;
  qty: number;
  image?: string;
};

// GET /api/cart
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    await connectToDatabase();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({error: "User not found"}, {status: 404});
    }

    const raw = Array.isArray(user.cart) ? user.cart : [];

    const items = raw.map((doc: CartItemDoc) => {
      const o = (
        typeof doc?.toObject === "function" ? doc.toObject() : doc
      ) as CartItemDoc;

      const price = Number(o.price) || 0;
      const qty = Number(o.qty) || 0;

      const image =
        o.image ||
        (Array.isArray(o.images) ? o.images[0] : undefined) ||
        o.heroImage ||
        "/placeholder.webp";

      return {
        ...o,
        _id: String(o._id), // stabilizacja
        key: o.key ?? makeKey(o), // teraz typ pasuje
        price,
        qty,
        image,
      };
    });

    const subtotal = items.reduce(
      (s: number, it: {price: number; qty: number}) => s + it.price * it.qty,
      0
    );

    return NextResponse.json({items, subtotal});
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}

// POST /api/cart  (add / increment)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const {item} = await request.json();
    if (!item || !item._id || item.price == null) {
      return NextResponse.json({error: "Invalid item data"}, {status: 400});
    }

    await connectToDatabase();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({error: "User not found"}, {status: 404});
    }

    // zawsze rób key na String(_id), żeby ObjectId != string nie rozjechały merge’a
    const key = item.key ?? makeKey(item); // makeKey: `${String(_id)}_${sku||size||"nosize"}`
    const qtyToAdd = Math.max(1, Number(item.qty ?? 1));

    if (!user.cart) user.cart = [];

    // <- to Ci brakowało
    const idx = (user.cart as CartItemDoc[]).findIndex(
      (c) => (c.key ?? makeKey(c)) === key
    );

    if (idx >= 0) {
      user.cart[idx].qty = Number(user.cart[idx].qty || 0) + qtyToAdd;
    } else {
      user.cart.push({
        ...item,
        _id: String(item._id), // normalizacja
        key,
        qty: qtyToAdd,
        price: Number(item.price), // upewnij się, że to liczba
        addedAt: new Date(),
      });
    }

    // jeśli cart ma typ Mixed:
    // user.markModified("cart");
    await user.save();

    const items = (user.cart as CartItemDoc[]).map((c) => ({
      ...(typeof c.toObject === "function" ? c.toObject() : c),
      _id: String(c._id),
      key: c.key ?? makeKey(c),
      price: Number(c.price) || 0,
      qty: Number(c.qty) || 0,
    }));

    const subtotal = items.reduce(
      (s: number, it: {price: number; qty: number}) => s + it.price * it.qty,
      0
    );

    return NextResponse.json({success: true, items, subtotal});
  } catch (err) {
    console.error("Cart POST error:", err);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}

// PUT /api/cart  (update qty by key)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({error: "Unauthorized"}, {status: 401});

    const body = await request.json();
    const qty = Number(body.qty);
    if (!Number.isFinite(qty))
      return NextResponse.json({error: "Invalid qty"}, {status: 400});

    await connectToDatabase();
    const user = await User.findById(session.user.id);
    if (!user)
      return NextResponse.json({error: "User not found"}, {status: 404});

    const key =
      body.key ??
      (body.itemId
        ? makeKey({_id: body.itemId, size: body.size, sku: body.sku})
        : null);
    if (!key) return NextResponse.json({error: "Missing key"}, {status: 400});

    if (!user.cart) user.cart = [];
    const idx = (user.cart as CartItemDoc[]).findIndex(
      (c) => (c.key ?? makeKey(c)) === key
    );
    if (qty <= 0) {
      if (idx >= 0) user.cart.splice(idx, 1);
    } else {
      if (idx >= 0) {
        user.cart[idx].qty = qty;
        user.cart[idx].key = user.cart[idx].key ?? key;
      }
    }

    // user.markModified("cart");
    await user.save();

    const items = (user.cart as CartItem[]).map((c) => ({
      ...c,
      key: c.key ?? makeKey(c),
    }));
    const subtotal = items.reduce(
      (s: number, it: {price: number; qty: number}) =>
        s + Number(it.price) * Number(it.qty || 0),
      0
    );

    return NextResponse.json({success: true, items, subtotal});
  } catch (err) {
    console.error("Cart PUT error:", err);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}

// DELETE /api/cart  (remove by key)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({error: "Unauthorized"}, {status: 401});

    const body = await request.json();
    const key =
      body.key ??
      (body.itemId
        ? makeKey({_id: body.itemId, size: body.size, sku: body.sku})
        : null);
    if (!key)
      return NextResponse.json({error: "Item key required"}, {status: 400});

    await connectToDatabase();
    const user = await User.findById(session.user.id);
    if (!user)
      return NextResponse.json({error: "User not found"}, {status: 404});

    user.cart = ((user.cart ?? []) as CartItemDoc[]).filter(
      (c) => (c.key ?? makeKey(c)) !== key
    );
    

    // user.markModified("cart");
    await user.save();

    const items = (user.cart as CartItem[]).map((c) => ({
      ...c,
      key: c.key ?? makeKey(c),
    }));
    const subtotal = items.reduce(
      (s: number, it: {price: number; qty: number}) =>
        s + Number(it.price) * Number(it.qty || 0),
      0
    );

    return NextResponse.json({success: true, items, subtotal});
  } catch (err) {
    console.error("Cart DELETE error:", err);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
