import { NextResponse } from "next/server";
import { db, products, inventory } from "@/src/db/client";

export async function GET() {
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
}
