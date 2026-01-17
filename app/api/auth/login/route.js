import { db } from "@/config/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();

    const { username, password, phone, isPhone } = body;

    let users;

    if (!isPhone) {
      if (!username || !password) {
        return NextResponse.json(
          { error: "Username and password are required" },
          { status: 400 }
        );
      }

      [users] = await db.execute(
        "SELECT user_id, username, password_hash FROM users WHERE username = ? LIMIT 1",
        [username]
      );

      if (users.length === 0) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }
    } else {
      if (!phone || !password) {
        return NextResponse.json(
          { error: "Phone Number and password are required" },
          { status: 400 }
        );
      }

      [users] = await db.execute(
        "SELECT user_id, phone, password_hash FROM users WHERE phone = ? LIMIT 1",
        [phone]
      );

      if (users.length === 0) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }
    }

    const user = users[0];    

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.user_id,
        username: user.username ?? null,
        phone: user.phone ?? null,
      },
    });

    response.cookies.set("userId", String(user.user_id), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      // secure: true, // enable in production (HTTPS)
    });

    return response;
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      error: error,
    });
  }
}
