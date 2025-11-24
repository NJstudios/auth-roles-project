import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, users } from "@/src/db/client";
import { getSessionByToken } from "@/src/lib/session";
import { eq } from "drizzle-orm";

export async function GET() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("session")?.value;

  if (!token) {
    return new NextResponse("Not authenticated", { status: 401 });
  }

  const session = await getSessionByToken(token);
  if (!session) {
    return new NextResponse("Not authenticated", { status: 401 });
  }

  const userRows = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  const user = userRows[0];
  if (!user) {
    return new NextResponse("Not authenticated", { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
}
