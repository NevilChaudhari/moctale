import { NextResponse } from "next/server";
import { db } from "@/config/db";

export async function POST(req: Request) {
    try {
        const { user_id, club_id } = await req.json();

        if (!user_id || !club_id) {
        return NextResponse.json(
            { error: "user_id and club_id are required" },
            { status: 400 }
        );
        }

        const [result]: any = await db.execute(
        `DELETE FROM user_clubs WHERE user_id = ? AND club_id = ?`,
        [user_id, club_id]
        );

        if (result.affectedRows === 0) {
        return NextResponse.json(
            { message: "No record found to delete" },
            { status: 404 }
        );
        }

        console.log("Club left successfully");

        return NextResponse.json(
        { success: true },
        { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json(
        { error: "Failed to delete club" },
        { status: 500 }
        );
    }
}