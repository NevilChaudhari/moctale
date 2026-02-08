import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { RowDataPacket } from "mysql2";

export async function POST(res: Response) {
    const body = await res.json();
    const {user_id, collection_id} = body;
    try {
        const [rows] = await db.execute<RowDataPacket[]>(
        "SELECT * FROM user_collections WHERE user_id = ? AND collection_id = ?", [user_id, collection_id],
        );

        console.log("UC:",rows);
        

        return NextResponse.json({ collection: rows });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
        { error: "Failed to fetch clubs" },
        { status: 500 }
        );
    }
}
