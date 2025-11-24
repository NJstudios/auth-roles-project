"use client";

import { useEffect, useState } from "react";

type Order = {
  id: string;
  status: string;
  totalCents: number;
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function loadOrders() {
    setError(null);
    const res = await fetch("/api/orders", { cache: "no-store" });
    if (!res.ok) {
      setError(`Error loading orders: ${res.status}`);
      return;
    }
    const data = await res.json();
    setOrders(data.orders);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <h1>My Orders</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {orders.map((o) => (
          <li key={o.id}>
            #{o.id} — {o.status} — ${(o.totalCents / 100).toFixed(2)} —{" "}
            {new Date(o.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
