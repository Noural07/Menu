import React from 'react';
import { MenuItem as MenuItemType } from '../types';
import { Plus } from 'lucide-react';

interface MenuItemProps {
  item: MenuItemType;
  onAddToCart: (item: MenuItemType) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, onAddToCart }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleAddToCart = () => {
    onAddToCart(item);
  };

  // Default image if none provided
  const imageUrl = item.imageUrl || 'https://images.pexels.com/photos/6287550/pexels-photo-6287550.jpeg';

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={item.name} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-[#7C9473] text-white">
            {item.category}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif text-lg font-bold text-gray-800">{item.name}</h3>
          <span className="font-medium text-[#8B0000]">{formatPrice(item.price)}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
        
        <button
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#8B0000] text-white transition-all duration-300 hover:bg-[#6B0000] active:scale-95"
        >
          <Plus size={16} />
          <span>Add to Order</span>
        </button>
      </div>
    </div>
  );
};

export default MenuItem;