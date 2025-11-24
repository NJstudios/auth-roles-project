import { NextResponse } from "next/server";
import { db, users } from "../../../../src/db/client";
import { hashPassword } from "../../../../src/lib/hash";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, name } = body;

  // check for existing user
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(password);

  const created = await db
    .insert(users)
    .values({
      email,
      name,
      passwordHash,
      role: "USER",
    })
    .returning();

  return NextResponse.json({ user: created[0] });
}
