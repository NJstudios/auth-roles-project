import { NextResponse } from "next/server";
import { db, products, inventory } from "@/src/db/client";
import { requireAdmin } from "@/src/lib/auth-guards";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const body = await req.json();
    const {
      name,
      description,
      sku,
      priceCents,
      initialQuantity = 0,
    } = body as {
      name: string;
      description?: string;
      sku: string;
      priceCents: number;
      initialQuantity?: number;
    };

    if (!name || !sku || typeof priceCents !== "number") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const [product] = await db
      .insert(products)
      .values({
        name,
        description,
        sku,
        priceCents,
      })
      .returning();

    await db.insert(inventory).values({
      productId: product.id,
      quantity: initialQuantity ?? 0,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (err: any) {
    if (err?.message === "UNAUTHENTICATED") {
      return new NextResponse("Not authenticated", { status: 401 });
    }
    if (err?.message === "FORBIDDEN") {
      return new NextResponse("Forbidden", { status: 403 });
    }
    console.error("Create product error:", err);
    return new NextResponse("Server error", { status: 500 });
  }
}

export async function GET() {
  try {
    await requireAdmin();

    const allProducts = await db.select().from(products);
    const allInventory = await db.select().from(inventory);

    const withStock = allProducts.map((p) => {
      const entry = allInventory.find((i) => i.productId === p.id);
      return {
        ...p,
        quantity: entry?.quantity ?? 0,
      };
    });

    return NextResponse.json({ products: withStock });
  } catch (err: any) {
    if (err?.message === "UNAUTHENTICATED") {
      return new NextResponse("Not authenticated", { status: 401 });
    }
    if (err?.message === "FORBIDDEN") {
      return new NextResponse("Forbidden", { status: 403 });
    }
    console.error("List products error:", err);
    return new NextResponse("Server error", { status: 500 });
  }
}
