import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/config/db";

export async function GET() {
  const userId = (await cookies()).get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [rows] = await db.execute(
    "SELECT intrestedIn FROM users WHERE user_id = ?",
    [userId.value]
  );

  console.log(`Intrests: ${rows[0].intrestedIn}`);
  console.log(`UserId: ${userId.value}`);
  

  return NextResponse.json({
    intrestedIn: rows[0]?.intrestedIn ?? "",
  });
}
