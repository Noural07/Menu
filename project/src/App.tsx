import React, { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import Header from './components/Header';
import MenuList from './components/MenuList';
import Cart from './components/Cart';
import CustomerForm from './components/CustomerForm';

function Shell() {
  const { state } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  const ready =
    state.tableId !== null && state.customerName.trim().length > 0;

  if (!ready) return <CustomerForm />;

  return (
    <div className="pb-16">
      {/* banner */}
      <div className="h-[30vh] bg-gradient-to-br from-[#8B0000] to-[#6B0000] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute -inset-[100px] rotate-45 scale-125 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg')" }}
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
          <h1 className="font-serif text-4xl font-bold mb-2">Bella Cucina</h1>
          <p className="text-lg opacity-90">Fine Italian Dining</p>
        </div>
      </div>

      <Header onCartClick={() => setCartOpen(o => !o)} />
      <main className="pt-20">
        <MenuList />
      </main>
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Shell />
    </CartProvider>
  );
}
