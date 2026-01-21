import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { RowDataPacket } from "mysql2";

interface Comment extends RowDataPacket {
  id: number;
  user_id: number;
  post_id: number;
  content: string;
  category: string;
  created_at: string;
}

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const [rows] = await db.execute<Comment[]>(
      "SELECT * FROM comments WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    return NextResponse.json({ comments: rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}
