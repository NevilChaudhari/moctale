import {NextResponse} from "next/server";
import {db} from "@/config/db";

export async function POST(req: Request) {
    const body = await req.json();
    const {club_name, club_banner, club_icon, club_desc, club_rules} = body;

    // Replace undefined with null
    const safeValues = [
        club_name ?? null,
        club_banner ?? null,
        club_icon ?? null,
        club_desc ?? null,
        club_rules ?? null,
    ];

    try {
        await db.execute(
            `INSERT INTO clubs
                (club_name, club_banner, club_icon, club_desc, club_rules)
                VALUES (?, ?, ?, ?, ?)`,
            safeValues,
        );

        console.log(safeValues);

        return NextResponse.json({success: true}, {status: 201});
    } catch (err) {
        console.error(err);
        return NextResponse.json({error: "Failed to insert media"}, {status: 500});
    }
}
