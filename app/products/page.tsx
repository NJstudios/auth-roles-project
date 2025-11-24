"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  sku: string;
  priceCents: number;
  quantity: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [orderingId, setOrderingId] = useState<string | null>(null);

  async function loadProducts() {
    setError(null);
    const res = await fetch("/api/products", { cache: "no-store" });
    if (!res.ok) {
      setError(`Error loading products: ${res.status}`);
      return;
    }
    const data = await res.json();
    setProducts(data.products);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleOrder(productId: string) {
    setError(null);
    setOrderingId(productId);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ productId, quantity: 1 }],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to place order");
        return;
      }
      // refresh stock
      await loadProducts();
      alert(`Order placed. ID: ${data.orderId}`);
    } catch (e) {
      setError("Network error");
    } finally {
      setOrderingId(null);
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <h1>Products</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {products.map((p) => (
          <li key={p.id} style={{ marginBottom: 16 }}>
            <strong>{p.name}</strong> ({p.sku}) –{" "}
            {(p.priceCents / 100).toFixed(2)} USD — Stock: {p.quantity}
            <div>
              <button
                onClick={() => handleOrder(p.id)}
                disabled={p.quantity <= 0 || orderingId === p.id}
              >
                {p.quantity <= 0
                  ? "Out of stock"
                  : orderingId === p.id
                  ? "Ordering..."
                  : "Buy 1"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
