import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { RowDataPacket } from "mysql2";

interface Media extends RowDataPacket {
  id: number;
  title: string;
  type: string;
  release_date: string;
  image_url: string | null;
}

interface MultiMediaRequest {
  userIds: number[];
}

export async function POST(req: Request) {
  try {
    const { userIds }: MultiMediaRequest = await req.json();

    if (!userIds || userIds.length === 0) {
      return NextResponse.json({ error: "IDs are required" }, { status: 400 });
    }

    const placeholders = userIds.map(() => "?").join(", ");
    const [rows] = await db.execute<Media[]>(
      `SELECT id, title, type, release_date, image_url FROM media WHERE id IN (${placeholders})`,
      userIds
    );

    return NextResponse.json({ success: rows }, { status: 200 });
  } catch (err) {
    console.error("Error fetching media:", err);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}
