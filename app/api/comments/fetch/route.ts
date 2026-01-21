import { NextResponse } from "next/server";
import { db } from "@/config/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Post id is required" },
        { status: 400 },
      );
    }

    const [rows] = await db.execute(
      "SELECT * FROM comments WHERE post_id = ?",
      [id],
    );

    // console.log(rows);

    return NextResponse.json({
      comments: rows,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}
