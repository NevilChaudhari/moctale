import {NextResponse} from "next/server";
import {db} from "@/config/db";

export async function POST(req: Request) {
    const body = await req.json();
    const {user_id, club_id} = body;

    const safeValues = [user_id ?? null, club_id ?? null];

    try {
        await db.execute(
        `INSERT INTO user_clubs (user_id, club_id) VALUES (?, ?);`,
        safeValues,
        );

        console.log(safeValues);

        return NextResponse.json({success: true}, {status: 201});
    } catch (err) {
        console.error(err);
        return NextResponse.json({error: "Failed to insert media"}, {status: 500});
    }
}
