import { NextResponse } from "next/server";
import { db } from "@/config/db";

export async function POST(req: Request) {
  const body = await req.json();
  const {user_id} = body

  console.log(body);

  const [rows]: any = await db.execute(
    "SELECT username, phone, password_hash, user_id, created_at, updated_at FROM users WHERE user_id = ? LIMIT 1",
    [user_id]
  );

  const username = rows?.[0]?.username ?? null;

  return NextResponse.json({ success: rows });
}
