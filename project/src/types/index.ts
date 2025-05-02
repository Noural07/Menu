// Menu item shown in UI
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
}

// Cart item (local use only)
export interface CartItem extends MenuItem {
  quantity: number;
  cafeId: number;
  itemCode: number; // added to match backend
}

// Used to build the order
export interface Order {
  tableId: number;
  items: CartItem[];
  comment?: string;
}

// Backend DTOs
export interface AddOrderItemRequest {
  orderId: number;
  cafeId: number;
  itemCode: number;
  quantity: number;
}

export interface SaveCommentRequest {
  orderId: number;
  comment: string;
}

// Generic API response wrapper
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
