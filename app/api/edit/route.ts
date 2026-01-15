import { NextResponse } from "next/server";
import { db } from "@/config/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, username, firstName, lastName, bio, profile_url } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const safeValues = [
      username ?? null,
      firstName ?? null,
      lastName ?? null,
      bio ?? null,
      profile_url ?? null,
      userId,
    ];

    await db.execute(
      `UPDATE users
       SET username = ?,
           first_name = ?,
           last_name = ?,
           bio = ?,
           profile_url = ?
       WHERE user_id = ?`,
      safeValues
    );

    const [data]: any = await db.execute(
      "SELECT username, first_name, last_name, bio, profile_url FROM users WHERE user_id = ? LIMIT 1",
      [userId]
    );
    return NextResponse.json({ success: true, data: data }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
