import { NextResponse } from "next/server";
import { db } from "@/config/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    console.log(`delete ID: ${id}`);
    

    await db.execute(`DELETE FROM comments WHERE id = ?`, [id]);

    console.log("deleted----------------------------");

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to insert comment" },
      { status: 500 },
    );
  }
}
