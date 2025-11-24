import { NextResponse } from "next/server";
import { db, users } from "@/src/db/client";
import { requireAdmin } from "@/src/lib/auth-guards";
import { eq } from "drizzle-orm";

export async function PATCH(req: Request, context: any) {
  // Next 15 may pass params as a Promise; this works in both cases
  const params = await context.params;
  const id = params.id as string;

  try {
    await requireAdmin();

    const body = await req.json();
    const role = (body as { role?: string }).role;

    if (role !== "USER" && role !== "ADMIN") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const updated = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      });

    if (updated.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: updated[0] });
  } catch (err: any) {
    if (err?.message === "UNAUTHENTICATED") {
      return new NextResponse("Not authenticated", { status: 401 });
    }
    if (err?.message === "FORBIDDEN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    console.error("Update role error:", err);
    return new NextResponse("Server error", { status: 500 });
  }
}
