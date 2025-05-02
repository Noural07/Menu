import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MenuList from './components/MenuList';
import Cart from './components/Cart';
import { CartProvider } from './context/CartContext';
import { Loader, AlertTriangle } from 'lucide-react';

const LoadingScreen: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white">
    <Loader className="w-12 h-12 text-[#8B0000] animate-spin mb-4" />
    <h2 className="text-xl font-serif font-bold text-[#8B0000] mb-2">Bella Cucina</h2>
    <p className="text-gray-600">Loading menu...</p>
  </div>
);

const ErrorScreen: React.FC<{ message: string }> = ({ message }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
    <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
    <h2 className="text-xl font-serif font-bold text-[#8B0000] mb-3">Error</h2>
    <p className="text-gray-700 mb-4 text-center">{message}</p>
    <button 
      onClick={() => window.location.reload()}
      className="px-4 py-2 bg-[#8B0000] text-white rounded-lg hover:bg-[#6B0000]"
    >
      Try Again
    </button>
  </div>
);

function MenuApp() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <div className="pb-16">
      <div className="h-[30vh] bg-gradient-to-br from-[#8B0000] to-[#6B0000] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -inset-[100px] rotate-45 scale-125 bg-cover bg-center" 
               style={{ backgroundImage: "url('https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg')" }}>
          </div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
          <h1 className="font-serif text-4xl font-bold mb-2 animate-fadeIn">Bella Cucina</h1>
          <p className="text-lg opacity-90 animate-fadeIn animation-delay-150">Fine Italian Dining</p>
        </div>
      </div>

      <Header onCartClick={handleCartToggle} />
      <div className="pt-20">
        <MenuList />
      </div>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <MenuApp />
    </CartProvider>
  );
}

export default App;