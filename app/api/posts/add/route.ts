import {db} from "@/config/db";

export async function POST(req: Request) {
    const body = await req.json();

    const {user_id, club_id, content, is_spoiler, clubId} = body;

    const [rows] = await db.execute(
        "INSERT INTO posts (user_id, club_id, content, is_spoiler) VALUES (?, ?, ?, ?)",
        [user_id, club_id, content, is_spoiler],
    );

    return new Response(JSON.stringify({message: "Post created", data: body}), {
        status: 201,
    });
}
