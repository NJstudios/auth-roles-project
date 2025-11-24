import crypto from "crypto";
import { db, sessions } from "../db/client";
import { eq } from "drizzle-orm";

export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

  await db.insert(sessions).values({
    userId,
    sessionToken: token,
    expiresAt,
  });

  return { token, expiresAt };
}

export async function getSessionByToken(token: string) {
  const rows = await db
    .select()
    .from(sessions)
    .where(eq(sessions.sessionToken, token))
    .limit(1);

  return rows[0] ?? null;
}
