const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:3000";

type Json = Record<string, unknown>;

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    credentials: "include",
    cache: "no-store",
  });

  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : null;

  if (!res.ok) {
    const message =
      data &&
      typeof data === "object" &&
      "error" in data &&
      (data as Json).error != null
        ? String((data as Json).error)
        : `HTTP ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}

export type Product = { id: number; name: string; price: string };

export type CartProduct = {
  id: number;
  name: string;
  quantity: number;
  unit_price: string;
  total_price: string;
};

export type Cart = { id: number; products: CartProduct[]; total_price: string };

export const api = {
  listProducts: () => request<Product[]>("/products", { method: "GET" }),
  getCart: () => request<Cart>("/cart", { method: "GET" }),
  addToCart: (product_id: number, quantity: number) =>
    request<Cart>("/cart", {
      method: "POST",
      body: JSON.stringify({ product_id, quantity }),
    }),
  addItem: (product_id: number, quantity: number) =>
    request<Cart>("/cart/add_item", {
      method: "POST",
      body: JSON.stringify({ product_id, quantity }),
    }),
  removeItem: (product_id: number) =>
    request<Cart>(`/cart/${product_id}`, { method: "DELETE" }),
};

