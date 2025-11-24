import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, sessions } from "../../../../src/db/client";
import { eq } from "drizzle-orm";

export async function POST() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("session")?.value;

  if (token) {
    await db
      .delete(sessions)
      .where(eq(sessions.sessionToken, token));
  }

  const res = NextResponse.json({ success: true });

  // clear cookie
  res.cookies.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
    path: "/",
  });

  return res;
}
