import { MenuItem, Order, CartItem, APIResponse, AddOrderItemRequest } from '../types';

const API_BASE_URL = 'https://localhost:7012/api';

/**
 * Udtrækker en query parameter fra URL'en (fx ?cafe=2 → cafeId = 2)
 */
const getCafeIdFromUrl = (): number => {
  return 16; // 👈 hardcoded til test
};

/**
 * Mapper CartItem til backend DTO-format
 */
const mapCartItemsToDto = (orderId: number, cart: CartItem[]): AddOrderItemRequest[] => {
  return cart.map(item => ({
    orderId,
    cafeId: item.cafeId,
    itemCode: item.itemCode,
    quantity: item.quantity
  }));
};

/**
 * Henter menuen for en specifik café (offentlig adgang via cafeId)
 */
export const getMenuItems = async (): Promise<APIResponse<MenuItem[]>> => {
  const cafeId = getCafeIdFromUrl();

  if (!cafeId) {
    return {
      success: false,
      error: 'Café ID not found in URL.',
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/Menu/public/${cafeId}`);

    if (!response.ok) {
      throw new Error(`Error fetching menu: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Failed to fetch menu items:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch menu items',
    };
  }
};

/**
 * Starter en ny ordre
 */
export const startOrder = async (tableId: number): Promise<APIResponse<number>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/CustomerOrder/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tableId,
        customerId: null,
        comment: null
      }),
    });

    if (!response.ok) {
      throw new Error(`Error starting order: ${response.statusText}`);
    }

    const data = await response.json(); // expects orderId
    return { success: true, data };
  } catch (error) {
    console.error('Failed to start order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to start order',
    };
  }
};

/**
 * Tilføjer ét item til en ordre
 */
export const addItemToOrder = async (item: AddOrderItemRequest): Promise<APIResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/CustomerOrder/add-item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error(`Error adding item to order: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Failed to add item to order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add item to order',
    };
  }
};

/**
 * Tilføjer en kommentar til en ordre
 */
export const addCommentToOrder = async (orderId: number, comment: string): Promise<APIResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/CustomerOrder/comment`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId, comment }),
    });

    if (!response.ok) {
      throw new Error(`Error adding comment to order: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Failed to add comment to order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add comment to order',
    };
  }
};

/**
 * Sender hele ordren til serveren
 */
export const submitOrder = async (orderId: number, order: Order): Promise<APIResponse<any>> => {
  try {
    const itemsDto = mapCartItemsToDto(orderId, order.items);

    for (const item of itemsDto) {
      const itemResponse = await addItemToOrder(item);
      if (!itemResponse.success) {
        throw new Error(itemResponse.error);
      }
    }

    if (order.comment && order.comment.trim() !== '') {
      const commentResponse = await addCommentToOrder(orderId, order.comment);
      if (!commentResponse.success) {
        throw new Error(commentResponse.error);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to submit order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit order',
    };
  }
};
