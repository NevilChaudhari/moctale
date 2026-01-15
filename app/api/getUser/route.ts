import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { RowDataPacket } from "mysql2";

interface User extends RowDataPacket {
  username: string;
  first_name: string;
  last_name: string;
  bio: string | null;
  profile_url: string | null;
}

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Type `rows` as User[]
    const [rows] = await db.execute<User[]>(
      "SELECT username, first_name, last_name, bio, profile_url FROM users WHERE user_id = ? LIMIT 1",
      [userId]
    );

    if (!rows?.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: rows[0] }, { status: 200 });
  } catch (err) {
    console.error("Error fetching user:", err);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
