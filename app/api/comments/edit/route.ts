import { NextResponse } from "next/server";
import { db } from "@/config/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, content, category } = body;

    const values = [content, category, id];

    await db.execute(
      `UPDATE comments
        SET content = ?, category = ?
        WHERE id=?;
      `,
      values,
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to insert comment" },
      { status: 500 },
    );
  }
}
