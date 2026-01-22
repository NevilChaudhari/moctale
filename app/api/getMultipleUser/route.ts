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
interface MultiUserRequest {
  userIds: number[];
}
export async function POST(req: Request) {
  try {
    const { userIds }: MultiUserRequest = await req.json();

    if (!userIds || userIds.length === 0) {
      return NextResponse.json(
        { error: "User IDs are required" },
        { status: 400 },
      );
    }

    const placeholders = userIds.map(() => "?").join(", ");
    const [rows] = await db.execute<User[]>(
      `SELECT user_id, username, first_name, last_name, bio, profile_url, intrestedIn
   FROM users WHERE user_id IN (${placeholders})`,
      userIds,
    );

    return NextResponse.json({ success: true, users: rows }, { status: 200 });
  } catch (err) {
    console.error("Error fetching users:", err);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
