import { db } from "@/config/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const {name, description, type, user_id } = body;

    const safeValues = [name ?? null, description ?? null, type ?? null, user_id ?? null];

    await db.execute(
        `INSERT INTO collections
        (name, description, type, user_id)
        VALUES (?, ?, ?, ?)`,
    safeValues,
    );
    
    console.log(safeValues);

    return NextResponse.json({success: true}, {status: 201});
}
