import { NextResponse } from "next/server";

import User from "@/models/User";
import { hash } from "bcryptjs";
import { connectToDatabase } from "../../../lib/mongodb";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { firstName, lastName, email, password, marketingOptIn } = await req.json();

    // Prosta walidacja (możesz podmienić na Zod/Yup)
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const existing = await User.findOne({ email: email.trim() });
    if (existing) {
      return NextResponse.json({ message: "Email already in use" }, { status: 409 });
    }

    const hashed = await hash(password, 10);

    const user = await User.create({
      email: email.trim(),
      password: hashed,
      firstName,
      lastName,
      marketingOptIn: !!marketingOptIn,
      role: "user",
    });

    // Zwracamy skromne dane (bez hasła)
    return NextResponse.json(
      {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
