// src/types/index.ts
/* ---------------- server data – used in UI ---------------- */
export interface MenuItem {
  id: number;
  cafeId: number;        // ← ➊ ADD THIS LINE
  name: string;
  price: number;
  itemCode: number;
  imageUrl?: string;
  description?: string;
  categoryId: number;
  categoryName: string;
}

export interface Category {
  id: number;
  name: string;
}

/* ---------------- local (cart) ---------------- */
export interface CartItem extends MenuItem {
  quantity: number;
}

/* ---------------- order DTOs ------------------ */
export interface Order {
  orderId?: number;          // created by the server
  tableId: number;
  customerName: string;
  items: CartItem[];
  comment?: string;
}

export interface AddOrderItemRequest {
  orderId: number;
  cafeId: number;
  itemCode: number;
  quantity: number;
}

export interface StartCustomerOrderRequest {
  tableId: number;
  customerName: string;
  comment?: string;
}

/* ---------------- misc ------------------------ */
export interface Table {
  id: number;
  label: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
