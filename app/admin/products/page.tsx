"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  sku: string;
  priceCents: number;
  quantity: number;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [priceCents, setPriceCents] = useState<number>(0);
  const [initialQuantity, setInitialQuantity] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  async function loadProducts() {
    setError(null);
    const res = await fetch("/api/admin/products", { cache: "no-store" });
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

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        sku,
        priceCents,
        initialQuantity,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed to create product");
      return;
    }

    setName("");
    setSku("");
    setPriceCents(0);
    setInitialQuantity(0);
    await loadProducts();
  }

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <h1>Admin: Products</h1>

      <form onSubmit={handleCreate} style={{ marginBottom: 24 }}>
        <h2>Create Product</h2>
        <div>
          <label>
            Name{" "}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            SKU{" "}
            <input
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Price (cents){" "}
            <input
              type="number"
              value={priceCents}
              onChange={(e) => setPriceCents(Number(e.target.value))}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Initial Quantity{" "}
            <input
              type="number"
              value={initialQuantity}
              onChange={(e) => setInitialQuantity(Number(e.target.value))}
            />
          </label>
        </div>
        <button type="submit">Create</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      <h2>Existing Products</h2>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Price ($)</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.sku}</td>
              <td>{(p.priceCents / 100).toFixed(2)}</td>
              <td>{p.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
