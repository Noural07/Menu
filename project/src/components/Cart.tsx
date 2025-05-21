import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import CartItem from './CartItem';
import { X, Send } from 'lucide-react';
import { startOrder, submitOrder } from '../services/api';
import { CartItem as CartItemType } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useCart();
  const [busy, setBusy]     = useState(false);
  const [error, setError]   = useState<string|null>(null);
  const [ok, setOk]         = useState<string|null>(null);

  /* price helper */
  const fmt = (v:number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'DKK'}).format(v);
  const total = state.items.reduce((t,i)=>t+i.price*i.quantity,0);

  /* main submit */
  const handleSubmit = async () => {
    if (!state.items.length)          { setError('Cart is empty'); return; }
    if (state.tableId === null)       { setError('Pick a table first'); return; }
    if (!state.customerName.trim())   { setError('Enter your name'); return; }

    setError(null); setBusy(true);

    try {
      let orderId = state.orderId;

      /* 1️⃣ create ticket if we don’t have one yet */
      if (!orderId) {
        const r = await startOrder({
          tableId: state.tableId,
          customerName: state.customerName,
          comment: state.comment || undefined,
        });
        if (!r.success || !r.data) throw new Error(r.error || 'Could not start order');
        orderId = r.data;
        dispatch({ type: 'SET_ORDER_ID', payload: orderId });
      }

      /* 2️⃣ send items / comment */
     const rs = await submitOrder({
  orderId,
  tableId: state.tableId!,
    customerName: state.customerName,
 items: state.items as CartItemType[],
  comment: state.comment,
});
      if (!rs.success) throw new Error(rs.error || 'Submit failed');

      setOk('Order submitted! 🎉');
      dispatch({ type: 'PLACE_ORDER' });

      /* reset after short delay */
      setTimeout(() => {
        dispatch({ type: 'RESET_CART' });
        onClose();
        setOk(null);
      }, 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unexpected error');
    } finally {
      setBusy(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className={`fixed inset-0 z-50 ${isOpen?'visible':'invisible'}`}>
      {/* backdrop */}
      <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isOpen?'opacity-50':'opacity-0'}`} onClick={onClose}/>
      
      {/* drawer */}
      <div className={`absolute top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-xl flex flex-col
                       transition-transform duration-300 ${isOpen?'translate-x-0':'translate-x-full'}`}>

        {/* header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-serif text-xl font-bold text-[#8B0000]">Your Order</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100"><X size={24}/></button>
        </div>

        {/* items */}
        <div className="flex-1 overflow-y-auto p-4">
          {state.items.length ? (
            <>
              {state.items.map(i=>(
                <CartItem
                  key={i.id}
                  item={i}
                  onUpdateQuantity={(id,q)=>dispatch({type:'UPDATE_QUANTITY',payload:{id,quantity:q}})}
                  onRemove={id=>dispatch({type:'REMOVE_ITEM',payload:id})}
                />
              ))}
              {/* comment */}
              <div className="mt-4">
                <label htmlFor="cmt" className="block text-sm font-medium mb-1">Special Instructions</label>
                <textarea id="cmt" rows={3}
                  className="w-full border rounded px-3 py-2 shadow-sm focus:ring-[#8B0000]"
                  placeholder="Any special requests or allergies?"
                  value={state.comment}
                  onChange={e=>dispatch({type:'SET_COMMENT',payload:e.target.value})}/>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <button className="px-4 py-2 bg-[#8B0000] text-white rounded-lg hover:bg-[#6B0000]" onClick={onClose}>
                Browse Menu
              </button>
            </div>
          )}

          {error && <p className="mt-4 p-3 bg-red-100 text-red-700 rounded">{error}</p>}
          {ok    && <p className="mt-4 p-3 bg-green-100 text-green-700 rounded">{ok}</p>}
        </div>

        {/* footer */}
        {state.items.length>0 && (
          <div className="border-t p-4">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Total</span>
              <span className="font-serif text-xl font-bold text-[#8B0000]">{fmt(total)}</span>
            </div>

            <button type="button" onClick={handleSubmit} disabled={busy}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white
                          ${busy?'opacity-70 cursor-not-allowed':'bg-[#8B0000] hover:bg-[#6B0000] active:scale-95'}`}>
              {busy ? <span className="animate-pulse">Processing…</span> : (<><Send size={18}/><span>Place Order</span></>)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
