import { NextResponse } from "next/server";
import { db, users } from "@/src/db/client";
import { requireAdmin } from "@/src/lib/auth-guards";

export async function GET() {
  try {
    await requireAdmin();

    const rows = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users);

    return NextResponse.json({ users: rows });
  } catch (err: any) {
    if (err?.message === "UNAUTHENTICATED") {
      return new NextResponse("Not authenticated", { status: 401 });
    }
    if (err?.message === "FORBIDDEN") {
      return new NextResponse("Forbidden", { status: 403 });
    }
    console.error("Admin users error:", err);
    return new NextResponse("Server error", { status: 500 });
  }
}
