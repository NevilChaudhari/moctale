import { db } from "@/config/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const {user_id, media_id, collection_id} = body;

    const safeValues = [user_id ?? null, media_id ?? null, collection_id ?? null];

    await db.execute(
        `INSERT INTO user_collections
        (user_id, media_id, collection_id)
        VALUES (?, ?, ?)`,
    safeValues,
    );
    
    console.log(safeValues);

    return NextResponse.json({success: true}, {status: 201});
}
