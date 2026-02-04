import {NextResponse} from "next/server";
import {db} from "@/config/db";

export async function POST(res: Response) {
    try {
        const body = await res.json();
        const {id} = body;

        const [rows] = await db.execute(
            `
            SELECT c.*
            FROM clubs c
            JOIN user_clubs uc ON c.id = uc.club_id
            WHERE uc.user_id = ?
            `,
        [id],
        );

        // console.log(`rows: ${JSON.stringify(rows)}`);
        

        return NextResponse.json({clubs: rows});
    } catch (err) {
        console.error(err);
        return NextResponse.json({error: "Failed to fetch clubs"}, {status: 500});
    }
}
