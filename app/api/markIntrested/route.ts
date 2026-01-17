import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/config/db";

export async function POST(req: Request) {
  const { id } = await req.json(); // value from frontend
  const userId = (await cookies()).get("userId")?.value;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await db.execute(
    `
    UPDATE users
    SET intrestedIn =
      CASE
        WHEN intrestedIn IS NULL OR intrestedIn = ''
          THEN ?
        ELSE CONCAT(intrestedIn, ',', ?)
      END
    WHERE user_id = ?
    `,
    [id, id, userId]
  );

  return NextResponse.json({ success: true });
}
