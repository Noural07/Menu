import { CartItem, AddOrderItemRequest } from '../types';

export const mapCartItemsToDto = (orderId: number, cart: CartItem[]): AddOrderItemRequest[] => {
  return cart.map(item => ({
    orderId,
    cafeId: item.cafeId,
    itemCode: item.itemCode,
    quantity: item.quantity
  }));
};