import React, { useState, useEffect, useCallback } from 'react';
import { MenuItem as MenuItemType } from '../types';
import { Plus, X } from 'lucide-react';

interface MenuItemProps {
  item: MenuItemType;
  onAddToCart: (item: MenuItemType) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, onAddToCart }) => {
  /* -------------------------------------------------------------------- */
  /* helpers                                                               */
  /* -------------------------------------------------------------------- */
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  const defaultImg =
    'https://images.pexels.com/photos/6287550/pexels-photo-6287550.jpeg';

  const imageUrl = item.imageUrl || defaultImg;

  /* -------------------------------------------------------------------- */
  /* full-image overlay state                                              */
  /* -------------------------------------------------------------------- */
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  /* esc-key listener – only active while overlay is open */
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  /* -------------------------------------------------------------------- */
  /* render                                                                */
  /* -------------------------------------------------------------------- */
  return (
    <>
      {/* card ------------------------------------------------------------ */}
      <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
        {/* image (clickable) */}
        <div className="relative h-48 overflow-hidden cursor-zoom-in" onClick={() => setOpen(true)}>
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* content */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-serif text-lg font-bold text-gray-800">{item.name}</h3>
            <span className="font-medium text-[#8B0000]">{formatPrice(item.price)}</span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {item.description || "No description available"}
          </p>

          <button
            onClick={() => onAddToCart(item)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#8B0000] text-white transition-all duration-300 hover:bg-[#6B0000] active:scale-95"
          >
            <Plus size={16} />
            <span>Add to Order</span>
          </button>
        </div>
      </div>

      {/* full-image overlay --------------------------------------------- */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={close}                 /* click outside to close */
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-200"
            onClick={close}
            title="Close"
          >
            <X size={28} />
          </button>

          <div className="max-w-4xl p-6 bg-white rounded-lg shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col md:flex-row gap-8">
              <img
                src={imageUrl}
                alt={item.name}
                className="md:w-1/2 h-auto object-cover rounded-lg"
              />
              <div className="md:w-1/2 flex flex-col">
                <h2 className="font-serif text-2xl font-bold text-gray-800 mb-2">{item.name}</h2>
                <span className="font-medium text-[#8B0000] text-lg mb-4">{formatPrice(item.price)}</span>
                
                <div className="bg-gray-100 px-3 py-2 rounded-md mb-4">
                  <span className="text-sm font-medium text-gray-600">Category: {item.categoryName}</span>
                </div>
                
                <p className="text-gray-700 mb-6">
                  {item.description || "No description available for this item."}
                </p>
                
                <button
                  onClick={() => {
                    onAddToCart(item);
                    close();
                  }}
                  className="mt-auto flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#8B0000] text-white transition-all duration-300 hover:bg-[#6B0000] active:scale-95"
                >
                  <Plus size={18} />
                  <span>Add to Order</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuItem;