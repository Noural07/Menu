import { MenuItem, Order, CartItem, APIResponse, AddOrderItemRequest } from "../types";

/**
 * Base URL for the backend API (adjust through env‑vars for prod/staging).
 */
const API_BASE_URL = "https://localhost:7012/api";

/**
 * Pulls the `cafe` query parameter from the location bar.
 * Throws early if it is missing or invalid – that makes bugs obvious during dev.
 */
export const getCafeIdFromUrl = (): number => {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("cafe");
  if (!raw) throw new Error("Café ID not found in URL.");
  const id = Number.parseInt(raw, 10);
  if (Number.isNaN(id)) throw new Error("Café ID in URL is not a valid number.");
  return id;
};

/** ──────────────────────────────────────────────────────────────────────────
 * Helpers
 * ────────────────────────────────────────────────────────────────────────*/
/**
 * Attempts to parse the response body as JSON.  If the body is empty (e.g. 204
 * No‑Content) or not valid JSON, it resolves to `null` instead of throwing –
 * preventing the common “Unexpected end of JSON input” runtime error.
 */
const safeJson = async <T = unknown>(response: Response): Promise<T | null> => {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

/** Maps cart lines to the DTO the backend expects. */
const mapCartItemsToDto = (
  orderId: number,
  cart: CartItem[]
): AddOrderItemRequest[] => {
  const cafeId = getCafeIdFromUrl();
  return cart.map(({ itemCode, quantity }) => ({
    orderId,
    cafeId,
    itemCode,
    quantity,
  }));
};

/** ──────────────────────────────────────────────────────────────────────────
 * API calls
 * ────────────────────────────────────────────────────────────────────────*/
export const getMenuItems = async (): Promise<APIResponse<MenuItem[]>> => {
  try {
    const cafeId = getCafeIdFromUrl();
    const res = await fetch(`${API_BASE_URL}/Menu/public/${cafeId}`);
    if (!res.ok) throw new Error(res.statusText);
    return { success: true, data: (await res.json()) as MenuItem[] };
  } catch (err) {
    console.error("getMenuItems() failed", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
};

export const startOrder = async (
  tableId: number
): Promise<APIResponse<number>> => {
  try {
    const res = await fetch(`${API_BASE_URL}/customerorder/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tableId, customerId: null, comment: null }),
    });
    if (!res.ok) throw new Error(res.statusText);
    return { success: true, data: (await res.json()) as number };
  } catch (err) {
    console.error("startOrder() failed", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
};

export const addItemToOrder = async (
  item: AddOrderItemRequest
): Promise<APIResponse<null>> => {
  try {
    const res = await fetch(`${API_BASE_URL}/customerorder/add-item`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error(res.statusText);
    await safeJson(res); // we ignore the value; we only care that the call succeeded
    return { success: true };
  } catch (err) {
    console.error("addItemToOrder() failed", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
};

export const addCommentToOrder = async (
  orderId: number,
  comment: string
): Promise<APIResponse<null>> => {
  try {
    const res = await fetch(`${API_BASE_URL}/customerorder/comment`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, comment }),
    });
    if (!res.ok) throw new Error(res.statusText);
    await safeJson(res);
    return { success: true };
  } catch (err) {
    console.error("addCommentToOrder() failed", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
};

export const submitOrder = async (
  orderId: number,
  order: Order
): Promise<APIResponse<void>> => {
  try {
    // 1️⃣ Post items sequentially (can be parallelised later if needed)
    for (const dto of mapCartItemsToDto(orderId, order.items)) {
      const res = await addItemToOrder(dto);
      if (!res.success) throw new Error(res.error);
    }

    // 2️⃣ Optional comment
    if (order.comment?.trim()) {
      const res = await addCommentToOrder(orderId, order.comment);
      if (!res.success) throw new Error(res.error);
    }

    return { success: true };
  } catch (err) {
    console.error("submitOrder() failed", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
};
