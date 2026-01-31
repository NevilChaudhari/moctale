import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
    try {
        const [rows] = await db.execute<RowDataPacket[]>(
        "SELECT * FROM clubs"
        );

        return NextResponse.json({ clubs: rows });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
        { error: "Failed to fetch clubs" },
        { status: 500 }
        );
    }
}
