import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Menu, ShoppingCart } from 'lucide-react';   // swapped icon
import { motion } from 'framer-motion';

interface Props {
  onCartClick: () => void;
}

const Header: React.FC<Props> = ({ onCartClick }) => {
  const { state }   = useCart();
  const totalItems  = state.items.reduce((s, i) => s + i.quantity, 0);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* animate badge pop-in */
  const badgeVariants = {
    hidden: { scale: 0 },
    visible: { scale: 1, transition: { type: 'spring', stiffness: 400, damping: 20 } },
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-20 transition-all duration-300
                  ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-gradient-to-b from-black/60 to-transparent py-4'}`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* logo / title */}
        <h1
          className={`font-serif font-bold tracking-wide text-lg md:text-xl transition-colors
                      ${scrolled ? 'text-[#8B0000]' : 'text-white'}`}
        >
          Bella&nbsp;Cucina
        </h1>

        {/* cart toggle */}
        <button
          onClick={onCartClick}
          className={`relative p-2 rounded-full transition-colors duration-200 group
                      ${scrolled ? 'hover:bg-[#8B0000]/10' : 'hover:bg-white/20'}`}
          aria-label="Open cart"
        >
          <ShoppingCart
            className={`h-6 w-6 transition-colors
                        ${scrolled ? 'text-[#8B0000]' : 'text-white group-hover:text-white'}`}
          />

          {/* qty badge */}
          {totalItems > 0 && (
            <motion.span
              initial="hidden"
              animate="visible"
              variants={badgeVariants}
              className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center
                         rounded-full bg-[#FFBF00] text-[#8B0000] text-[11px] font-bold shadow-md"
            >
              {totalItems}
            </motion.span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
