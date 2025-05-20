import React from 'react';
import { CartItem as CartItemType } from '../types';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ 
  item, 
  onUpdateQuantity, 
  onRemove 
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const totalPrice = item.price * item.quantity;

  return (
    <div className="flex items-start border-b border-gray-200 py-4 animate-slideIn">
      <div className="flex-1">
        <h4 className="font-medium text-gray-800">{item.name}</h4>
        <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
        <p className="font-medium text-[#8B0000]">{formatPrice(item.price)}</p>
      </div>
      
      <div className="flex flex-col items-end ml-4">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          
          <span className="px-2 py-1 min-w-[30px] text-center">
            {item.quantity}
          </span>
          
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>
        
        <p className="text-sm font-medium mt-2">
          Total: {formatPrice(totalPrice)}
        </p>
        

      </div>
    </div>
  );
};

export default CartItem;