import { db } from "@/config/db";

export async function POST(req: Request) {
    const body = await req.json();
    const { table_name } = body;

    // Using template string for table name (safe because we validated)
    const query = `
        SELECT *
        FROM Likes
        WHERE tableName = ?;
    `;

    const [rows] = await db.execute(query, [table_name]);
    console.log(rows);
    
    return new Response(JSON.stringify({ message: "Like fetched successfully", data: rows }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
