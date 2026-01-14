// app/api/media/route.ts
import { NextResponse } from "next/server";
import { db } from "@/config/db";

export async function GET() {
  try {
    const [rows] = await db.execute("SELECT * FROM media");
    console.log([rows]);
    
    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}