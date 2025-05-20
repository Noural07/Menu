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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleUpdateQuantity = (id: number, quantity: number) => {
    dispatch({ 
      type: 'UPDATE_QUANTITY', 
      payload: { id, quantity } 
    });
  };

  const handleRemoveItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'SET_COMMENT', payload: e.target.value });
  };

  const calculateTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleSubmitOrder = async () => {
    if (state.items.length === 0) {
      setErrorMessage('Cannot submit an empty order');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // STEP 1: Start the order to get orderId
      const start = await startOrder(1);
      if (!start.success || !start.data) {
        throw new Error(start.error || 'Failed to start order');
      }

      const orderId = start.data;

      // STEP 2: Submit the full order
      const response = await submitOrder(orderId, {
        tableId: state.tableId,
        items: state.items as CartItemType[],
        comment: state.comment,
      });

      if (response.success) {
        setSuccessMessage('Your order has been submitted successfully!');
        dispatch({ type: 'PLACE_ORDER' });

        // Clear cart after short delay
        setTimeout(() => {
          dispatch({ type: 'RESET_CART' });
          onClose();
          setSuccessMessage(null);
        }, 3000);
      } else {
        throw new Error(response.error || 'Failed to submit order');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error occurred');
    }

    setIsSubmitting(false);
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'visible' : 'invisible'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={onClose}
      ></div>

      {/* Cart panel */}
      <div className={`absolute top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-xl transition-transform duration-300 ease-in-out overflow-hidden flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-serif text-xl font-bold text-[#8B0000]">Your Order</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart content */}
        <div className="flex-1 overflow-y-auto p-4">
          {state.items.length > 0 ? (
            <>
              {state.items.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}

              <div className="mt-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                  Special Instructions
                </label>
                <textarea
                  id="comment"
                  rows={3}
                  placeholder="Any special requests or allergies?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000]"
                  value={state.comment}
                  onChange={handleCommentChange}
                ></textarea>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#8B0000] text-white rounded-lg hover:bg-[#6B0000]"
              >
                Browse Menu
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
              {successMessage}
            </div>
          )}
        </div>

        {/* Footer with total and checkout button */}
        {state.items.length > 0 && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Total</span>
              <span className="font-serif text-xl font-bold text-[#8B0000]">
                {formatPrice(calculateTotal())}
              </span>
            </div>

            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#8B0000] text-white transition-all duration-300 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#6B0000] active:scale-95'
              }`}
            >
              {isSubmitting ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <>
                  <Send size={18} />
                  <span>Place Order</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
