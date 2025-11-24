import { cookies } from "next/headers";
import { db, users, sessions } from "../db/client";
import { eq } from "drizzle-orm";

export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("session")?.value;
  if (!token) return null;

  const sessionRows = await db
    .select()
    .from(sessions)
    .where(eq(sessions.sessionToken, token))
    .limit(1);

  const session = sessionRows[0];
  if (!session) return null;

  const userRows = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  const user = userRows[0];
  if (!user) return null;

  return user;
}
