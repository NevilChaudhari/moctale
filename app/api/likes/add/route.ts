import { db } from "@/config/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, table, postId, userLiked } = body;

        if (!userId || !postId || !table) {
            return new Response(
                JSON.stringify({ message: "Missing parameters" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const likeQuery = `
            INSERT INTO Likes (userId, postId, tableName)
            VALUES (?, ?, ?)
        `;

        const unlikeQuery = `
            DELETE FROM Likes
            WHERE userId = ? AND postId = ? AND tableName = ?
        `;        

        await db.execute(userLiked ? unlikeQuery : likeQuery, [userId, postId, table]);

        return new Response(
            JSON.stringify({ message: "Like updated successfully" }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error(err);
        return new Response(
            JSON.stringify({ message: "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
