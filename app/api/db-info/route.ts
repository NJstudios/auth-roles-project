import { NextResponse } from "next/server";
import { db, users } from "@/src/db/client";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Count users in a type-safe way
    const [row] = await db
      .select({
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(users);

    return NextResponse.json({
      databaseUrl: process.env.DATABASE_URL ?? null,
      userCount: row.count,
    });
  } catch (err) {
    console.error("DB info error:", err);
    return new NextResponse("DB info error", { status: 500 });
  }
}
