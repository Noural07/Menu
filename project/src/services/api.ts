import {
  MenuItem,
  Order,
  CartItem,
  Table,
  StartCustomerOrderRequest,
  AddOrderItemRequest,
  APIResponse,
} from '../types';

const API_BASE_URL = 'https://localhost:7012/api';

/* ─ helpers ─ */
const getCafeIdFromUrl = (): number => {
  // Try to extract cafeId from `/menu/{cafeId}` path
  const match = window.location.pathname.match(/\/menu\/(\d+)/);
  if (match && match[1]) {
    const id = Number.parseInt(match[1], 10);
    if (!Number.isNaN(id)) return id;
    throw new Error('Café ID in URL path is not a number.');
  }
  throw new Error('Café ID not found in URL path.');
};

const safeJson = async <T>(r: Response): Promise<T | null> => {
  try { return (await r.json()) as T; } catch { return null; }
};

const mapCart = (orderId: number, items: CartItem[]): AddOrderItemRequest[] =>
  items.map(({ itemCode, quantity, cafeId }) => ({
    orderId,
    cafeId,
    itemCode,
    quantity,
  }));

/* ─ public tables ─ */
export const getTables = async (): Promise<APIResponse<Table[]>> => {
  try {
    const cafeId = getCafeIdFromUrl();
    const res = await fetch(`${API_BASE_URL}/tables/public/${cafeId}`);
    if (!res.ok) throw new Error(res.statusText);
    return { success: true, data: (await res.json()) as Table[] };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
};

/* ─ public menu ─ */
export const getMenuItems = async (): Promise<APIResponse<MenuItem[]>> => {
  try {
    const cafeId = getCafeIdFromUrl();
    const res = await fetch(`${API_BASE_URL}/Menu/public/${cafeId}`);
    if (!res.ok) throw new Error(res.statusText);
    return { success: true, data: (await res.json()) as MenuItem[] };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
};

/* ─ start ticket ─ */
export const startOrder = async (
  req: StartCustomerOrderRequest,
): Promise<APIResponse<number>> => {
  try {
    const r = await fetch(`${API_BASE_URL}/customerorder/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (!r.ok) throw new Error(await r.text());
    return { success: true, data: (await r.json()) as number };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
};

/* ─ add single line ─ */
export const addItemToOrder = async (
  item: AddOrderItemRequest,
): Promise<APIResponse<null>> => {
  try {
    const r = await fetch(`${API_BASE_URL}/customerorder/add-item`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!r.ok) throw new Error(r.statusText);
    await safeJson(r);
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
};

/* ─ optional comment ─ */
export const addCommentToOrder = async (
  orderId: number,
  comment: string,
): Promise<APIResponse<null>> => {
  try {
    const r = await fetch(`${API_BASE_URL}/customerorder/comment`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, comment }),
    });
    if (!r.ok) throw new Error(r.statusText);
    await safeJson(r);
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
};

/* ─ submit full order ─ */
export const submitOrder = async (
  order: Order, // orderId now travels *inside* this object
): Promise<APIResponse<void>> => {
  try {
    for (const dto of mapCart(order.orderId!, order.items)) {
      const res = await addItemToOrder(dto);
      if (!res.success) throw new Error(res.error);
    }
    if (order.comment?.trim()) {
      const res = await addCommentToOrder(order.orderId!, order.comment);
      if (!res.success) throw new Error(res.error);
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
};
