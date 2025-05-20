import React, { useState } from 'react';
import MenuItemCard from './MenuItem';
import { useMenu } from '../hooks/useMenu';
import { useCart } from '../context/CartContext';
import { MenuItem as MenuItemType } from '../types';
import { Loader } from 'lucide-react';

const MenuList: React.FC = () => {
  const { menuItems, categories, isLoading, error } = useMenu();
  const { dispatch }  = useCart();
  const [activeCatId, setActiveCatId] = useState<number | null>(null);

  const addToCart = (item: MenuItemType) =>
    dispatch({ type: 'ADD_ITEM', payload: item });

  /** filtrér på kategori-id */
  const visibleItems = activeCatId
    ? menuItems.filter(i => i.categoryId === activeCatId)
    : menuItems;

  /* ---------- loading / error ---------- */
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <Loader className="w-10 h-10 animate-spin text-[#8B0000] mb-2" />
        Loading menu…
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center text-red-600 py-10">
        {error}
      </div>
    );
  }

  /* ---------- UI ---------- */
  return (
    <div className="pb-24">
      {/* kategori-knapper */}
      <div className="sticky top-1 z-10 bg-white px-4 py-2 shadow-sm overflow-x-auto">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveCatId(null)}
            className={`px-4 py-1.5 rounded-full text-sm ${
              activeCatId === null
                ? 'bg-[#8B0000] text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            All items
          </button>

          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCatId(c.id)}
              className={`px-4 py-1.5 rounded-full text-sm ${
                activeCatId === c.id
                  ? 'bg-[#8B0000] text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* item-grid */}
      <div className="px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {visibleItems.length ? (
          visibleItems.map(i => (
            <MenuItemCard key={i.id} item={i} onAddToCart={addToCart} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-12">
            No items in this category
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuList;
