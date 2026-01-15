import { NextResponse } from "next/server";
import { db } from "@/config/db";

export async function POST(req: Request) {
  const body = await req.json();
  const { search } = body;

  console.log(body);

  const [movies]: any = await db.execute(
    `
  SELECT id, title, image_url, release_date, type
  FROM media
  WHERE title LIKE ?
  `,
    [`%${search}%`]
  );

  const [users]: any = await db.execute(
    `
  SELECT user_id, username, profile_url FROM users WHERE username LIKE ? `,
    [`%${search}%`]
  );

  console.log(users);
  

  return NextResponse.json({ movies: movies, users: users });
}
