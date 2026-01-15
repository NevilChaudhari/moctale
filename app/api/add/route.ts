import { NextResponse } from "next/server";
import { db } from "@/config/db";

export async function POST(req: Request) {
  const body = await req.json();
  const {
    title,
    type,
    releaseDate,
    director,
    cast,
    genre,
    country,
    languages,
    production,
    tags,
    description,
    streaming_platforms,
    current_status,
    poster_url,
    trailer_url,
  } = body;

  // Replace undefined with null
  const safeValues = [
    title ?? null,
    type ?? null,
    releaseDate ?? null,
    director ?? null,
    cast ?? null,
    genre ?? null,
    country ?? null,
    languages ?? null,
    production ?? null,
    tags ?? null,
    description ?? null,
    streaming_platforms ? JSON.stringify(streaming_platforms) : null,
    current_status ?? null,
    poster_url ?? null,
    trailer_url ?? null,
  ];

  try {
    await db.execute(
      `INSERT INTO media 
       (title, type, release_date, director, cast, genre, country, languages, studios, tags, description, streaming_platform, current_status, image_url, trailer_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      safeValues
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to insert media" },
      { status: 500 }
    );
  }
}

