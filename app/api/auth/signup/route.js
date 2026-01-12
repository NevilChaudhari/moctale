import { db } from "@/config/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json(); // Convert JSON text → JS object

    const { first_name, last_name, username, password, phone } = body;

    if (!first_name || !last_name || !username || !password) {
      return NextResponse.json(
        { error: "Please fill all required fields" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return new NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const [users] = await db.execute(
      "SELECT user_id FROM users WHERE username = ?",
      [username]
    );

    if (users.length > 0) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO users (first_name, last_name, username, password_hash, phone) VALUES (?, ?, ?, ?, ?)",
      [first_name, last_name, username, hashedPassword, phone || null]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      {
        status: 500,
      }
    );
  }
}
