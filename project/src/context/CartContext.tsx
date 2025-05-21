import React, {
  createContext,
  useReducer,
  useContext,
  useEffect,
} from 'react';
import { MenuItem, CartItem } from '../types';

/* ─ state & actions ─ */
interface CartState {
  orderId: number | null;
  tableId: number | null;
  customerName: string;
  items: CartItem[];
  comment: string;
  isOrderPlaced: boolean;
}

type CartAction =
  | { type: 'SET_ORDER_ID';     payload: number }
  | { type: 'SET_TABLE_ID';     payload: number }
  | { type: 'SET_CUSTOMER_NAME';payload: string }
  | { type: 'ADD_ITEM';         payload: MenuItem }
  | { type: 'REMOVE_ITEM';      payload: number }
  | { type: 'UPDATE_QUANTITY';  payload: { id: number; quantity: number } }
  | { type: 'SET_COMMENT';      payload: string }
  | { type: 'PLACE_ORDER' }
  | { type: 'RESET_CART' };

const initialState: CartState = {
  orderId: null,
  tableId: null,
  customerName: '',
  items: [],
  comment: '',
  isOrderPlaced: false,
};

/* ─ reducer ─ */
const reducer = (s: CartState, a: CartAction): CartState => {
  switch (a.type) {
    case 'SET_ORDER_ID':      return { ...s, orderId: a.payload };
    case 'SET_TABLE_ID':      return { ...s, tableId: a.payload };
    case 'SET_CUSTOMER_NAME': return { ...s, customerName: a.payload };

    case 'ADD_ITEM': {
      const idx = s.items.findIndex(i => i.id === a.payload.id);
      if (idx >= 0) {
        const items = [...s.items];
        items[idx] = { ...items[idx], quantity: items[idx].quantity + 1 };
        return { ...s, items };
      }
      return { ...s, items: [...s.items, { ...a.payload, quantity: 1 }] };
    }

    case 'REMOVE_ITEM':
      return { ...s, items: s.items.filter(i => i.id !== a.payload) };

    case 'UPDATE_QUANTITY':
      return {
        ...s,
        items: s.items.map(i =>
          i.id === a.payload.id ? { ...i, quantity: a.payload.quantity } : i),
      };

    case 'SET_COMMENT':   return { ...s, comment: a.payload };
    case 'PLACE_ORDER':   return { ...s, isOrderPlaced: true };

    case 'RESET_CART':    return initialState;
    default:              return s;
  }
};

/* ─ context ─ */
const Ctx = createContext<{state: CartState; dispatch: React.Dispatch<CartAction>}>({
  state: initialState,
  dispatch: () => null,
});

export const CartProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  /* persist items only (not table/name/order) */
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(state.items));
  }, [state.items]);

  /* restore items only */
  useEffect(() => {
    const raw = localStorage.getItem('cartItems');
    if (raw) {
      try {
        const arr: CartItem[] = JSON.parse(raw);
        arr.forEach(it => dispatch({ type: 'ADD_ITEM', payload: it as MenuItem }));
      } catch {/* ignore */}
    }
  }, []);

  return (
    <Ctx.Provider value={{ state, dispatch }}>
      {children}
    </Ctx.Provider>
  );
};

export const useCart = () => useContext(Ctx);
