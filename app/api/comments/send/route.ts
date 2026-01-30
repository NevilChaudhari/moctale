import {NextResponse} from "next/server";
import {db} from "@/config/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {user_id, post_id, parent_id, content, category} = body;

    if (!user_id || !post_id || !content) {
      return NextResponse.json(
        {error: "Missing required fields"},
        {status: 400},
      );
    }

    const values = [post_id, user_id, parent_id ?? null, content, category];

    await db.execute(
      `INSERT INTO comments (post_id, user_id, parent_id, content, category)
       VALUES (?, ?, ?, ?, ?)`,
      values,
    );

    return NextResponse.json({success: true}, {status: 201});
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {error: "Failed to insert comment"},
      {status: 500},
    );
  }
}
