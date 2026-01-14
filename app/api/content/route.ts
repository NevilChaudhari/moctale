import { NextResponse } from "next/server";
import { db } from "@/config/db";

export async function POST(req: Request) {
  const body = await req.json();
  const { id } = body;

  console.log(body);

  const [rows]: any = await db.execute(
    "SELECT title, type, release_date, director, cast, genre, country, languages, studios, tags, description, streaming_platform, current_status, image_url, trailer_url FROM media WHERE id = ? LIMIT 1",
    [id]
  );

  console.log(rows[0]);

  return NextResponse.json({ success: rows });
}
