import {db} from "@/config/db";

export async function POST(req: Request) {
    const body = await req.json();
    const {id} = body;

    const [rows] = await db.execute(
        "SELECT * FROM posts WHERE (? IS NULL OR club_id = ?) ORDER BY created_at DESC",
        [id ?? null, id ?? null],
    );

    return new Response(JSON.stringify({posts: rows}), {status: 200});
}
