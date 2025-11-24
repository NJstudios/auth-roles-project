import { NextResponse } from "next/server";
import { db, users } from "../../../src/db/client";

export async function GET() {
  try {
    const allUsers = await db.select().from(users).limit(5);
    return NextResponse.json({ data: allUsers });
  } catch (error) {
    console.error("DB test error:", error);
    return new NextResponse("DB error", { status: 500 });
  }
}