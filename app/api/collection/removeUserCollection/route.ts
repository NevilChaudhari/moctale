import {NextResponse} from "next/server";
import {db} from "@/config/db";

export async function POST(req: Request) {
    try {
        const {user_id, media_id, collection_id} = await req.json();

        if (!user_id || !media_id) {
        return NextResponse.json(
            {error: "user_id and media_id are required"},
            {status: 400},
        );
        }

        const [result]: any = await db.execute(
        `DELETE FROM user_collections WHERE user_id = ? AND media_id = ? AND collection_id = ?`,
        [user_id, media_id, collection_id],
        );

        if (result.affectedRows === 0) {
        return NextResponse.json(
            {message: "No record found to delete"},
            {status: 404},
        );
        }

        console.log("Collection removed successfully");

        return NextResponse.json({success: true}, {status: 200});
    } catch (err) {
        console.error(err);
        return NextResponse.json({error: "Failed to delete club"}, {status: 500});
    }
}
