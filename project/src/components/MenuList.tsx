import React, { useState } from 'react';
import MenuItem from './MenuItem';
import { useMenu } from '../hooks/useMenu';
import { useCart } from '../context/CartContext';
import { MenuItem as MenuItemType } from '../types';
import { Loader } from 'lucide-react';

const MenuList: React.FC = () => {
  const { menuItems, categories, isLoading, error } = useMenu();
  const { dispatch } = useCart();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleAddToCart = (item: MenuItemType) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    
    // Show notification animation (this could be enhanced with a proper notification system)
    // For now we'll just use a simple alert
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transform transition-all duration-500 opacity-0 translate-y-[-20px]';
    notification.textContent = `${item.name} added to order`;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Animate out
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(-20px)';
    }, 2000);
    
    // Remove from DOM
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 2500);
  };

  const filteredItems = activeCategory
    ? menuItems.filter(item => item.category === activeCategory)
    : menuItems;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader className="w-10 h-10 text-[#8B0000] animate-spin mb-4" />
        <p className="text-gray-600">Loading menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#8B0000] text-white rounded-lg hover:bg-[#6B0000]"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Category filter */}
      <div className="overflow-x-auto px-4 py-3 mb-4 sticky top-1 bg-white z-[5] shadow-sm">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              activeCategory === null
                ? 'bg-[#8B0000] text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            All Items
          </button>
          
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeCategory === category
                  ? 'bg-[#8B0000] text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu items grid */}
      <div className="px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <MenuItem
              key={item.id}
              item={item}
              onAddToCart={handleAddToCart}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No menu items found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuList;