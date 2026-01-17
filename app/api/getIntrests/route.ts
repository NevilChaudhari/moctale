import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { RowDataPacket } from "mysql2";

interface Media extends RowDataPacket {
  title: string;
  release_date: string;
  image_url: string;
  type: string;
}

export async function POST(req: Request) {
  try {
    const { intrestedIn } = await req.json();

    if (!intrestedIn) {
      return NextResponse.json(
        { error: "Media ID is required" },
        { status: 400 },
      );
    }

    const ids = intrestedIn.split(",").map((id: string) => id.trim()); // ["17", "19"]
    const placeholders = ids.map(() => "?").join(",");

    const [rows] = await db.execute<Media[]>(
      `SELECT id, title, release_date, image_url, type FROM media WHERE id IN (${placeholders})`,
      ids
    );

    if (!rows?.length) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    // console.log(`IDs: ${ids}`);
    // console.log(`Data: ${JSON.stringify(rows)}`);

    return NextResponse.json({ success: true, data: rows }, { status: 200 });
  } catch (err) {
    console.error("Error fetching media:", err);
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 },
    );
  }
}
