import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Menu } from 'lucide-react';

const Header: React.FC<{ onCartClick: () => void }> = ({ onCartClick }) => {
  const { state } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-10 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-gradient-to-b from-black/50 to-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className={`font-serif text-xl font-bold transition-colors duration-300 ${
          isScrolled ? 'text-[#8B0000]' : 'text-white'
        }`}>
          Bella Cucina
        </h1>
        
        <button 
          onClick={onCartClick}
          className="relative p-2 rounded-full transition-colors duration-300"
          aria-label="Open cart"
        >
          <Menu 
            className={`h-6 w-6 transition-colors duration-300 ${
              isScrolled ? 'text-[#8B0000]' : 'text-white'
            }`} 
          />
          
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#FFBF00] text-[#8B0000] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header