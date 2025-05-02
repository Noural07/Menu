import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { MenuItem, CartItem, Order } from '../types';

interface CartState {
  tableId: number | null;
  items: CartItem[];
  comment: string;
  isLoading: boolean;
  error: string | null;
  isOrderPlaced: boolean;
}

type CartAction = 
  | { type: 'SET_TABLE_ID'; payload: number }
  | { type: 'ADD_ITEM'; payload: MenuItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'SET_COMMENT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'PLACE_ORDER' }
  | { type: 'RESET_CART' };

const initialState: CartState = {
  tableId: null,
  items: [],
  comment: '',
  isLoading: false,
  error: null,
  isOrderPlaced: false,
};

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_TABLE_ID':
      return { ...state, tableId: action.payload };
    
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (existingItemIndex >= 0) {
        // Item already exists, increase quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return { ...state, items: updatedItems };
      } else {
        // Add new item with quantity 1
        return { 
          ...state, 
          items: [...state.items, { ...action.payload, quantity: 1 }] 
        };
      }
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return {
          ...state,
          items: state.items.filter(item => item.id !== id)
        };
      }
      
      return {
        ...state,
        items: state.items.map(item => 
          item.id === id ? { ...item, quantity } : item
        )
      };
    }
    
    case 'SET_COMMENT':
      return { ...state, comment: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'PLACE_ORDER':
      return { ...state, isOrderPlaced: true };
    
    case 'RESET_CART':
      return { 
        ...initialState, 
        tableId: state.tableId // Preserve the table ID
      };
    
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('restaurantCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart) as CartState;
        
        // Only restore non-completed orders for the current table
        if (parsedCart && !parsedCart.isOrderPlaced) {
          Object.entries(parsedCart).forEach(([key, value]) => {
            if (key !== 'isLoading' && key !== 'error') {
              dispatch({ 
                type: key as any, 
                payload: value 
              } as any);
            }
          });
        }
      } catch (error) {
        console.error('Failed to parse saved cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const cartToSave = {
      tableId: state.tableId,
      items: state.items,
      comment: state.comment,
      isOrderPlaced: state.isOrderPlaced
    };
    localStorage.setItem('restaurantCart', JSON.stringify(cartToSave));
  }, [state.tableId, state.items, state.comment, state.isOrderPlaced]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);