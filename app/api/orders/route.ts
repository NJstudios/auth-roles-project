import { NextResponse } from "next/server";
import { db, orders, orderItems, products, inventory } from "@/src/db/client";
import { requireUser } from "@/src/lib/auth-guards";
import { eq, inArray } from "drizzle-orm";

type OrderItemInput = {
  productId: string;
  quantity: number;
};

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = (await req.json()) as { items: OrderItemInput[] };

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "No items" }, { status: 400 });
    }

    // normalize / validate quantities
    const items = body.items.map((i) => ({
      productId: i.productId,
      quantity: Number(i.quantity) || 0,
    }));

    if (items.some((i) => i.quantity <= 0)) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }

    const productIds = [...new Set(items.map((i) => i.productId))];

    const dbProducts = await db
      .select()
      .from(products)
      .where(inArray(products.id, productIds));

    const dbInventory = await db
      .select()
      .from(inventory)
      .where(inArray(inventory.productId, productIds));

    // validate existence and stock
    for (const item of items) {
      const p = dbProducts.find((x) => x.id === item.productId);
      if (!p) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }

      const inv = dbInventory.find((x) => x.productId === item.productId);
      const available = inv?.quantity ?? 0;

      if (item.quantity > available) {
        return NextResponse.json(
          {
            error: `Insufficient stock for product ${p.name}`,
            available,
          },
          { status: 400 }
        );
      }
    }

    const totalCents = items.reduce((sum, item) => {
      const p = dbProducts.find((x) => x.id === item.productId)!;
      return sum + p.priceCents * item.quantity;
    }, 0);

    const [order] = await db
      .insert(orders)
      .values({
        userId: user.id,
        status: "PENDING",
        totalCents,
      })
      .returning();

    for (const item of items) {
      const p = dbProducts.find((x) => x.id === item.productId)!;

      await db.insert(orderItems).values({
        orderId: order.id,
        productId: p.id,
        quantity: item.quantity,
        priceCents: p.priceCents,
      });

      const inv = dbInventory.find((x) => x.productId === p.id)!;
      const newQty = (inv?.quantity ?? 0) - item.quantity;

      await db
        .update(inventory)
        .set({ quantity: newQty })
        .where(eq(inventory.productId, p.id));
    }

    return NextResponse.json({ orderId: order.id });
  } catch (err: any) {
    if (err?.message === "UNAUTHENTICATED") {
      return new NextResponse("Not authenticated", { status: 401 });
    }
    console.error("Create order error:", err);
    return new NextResponse("Server error", { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await requireUser();

    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, user.id));

    // you can expand this later to join orderItems/products
    return NextResponse.json({ orders: userOrders });
  } catch (err: any) {
    if (err?.message === "UNAUTHENTICATED") {
      return new NextResponse("Not authenticated", { status: 401 });
    }
    console.error("List orders error:", err);
    return new NextResponse("Server error", { status: 500 });
  }
}
