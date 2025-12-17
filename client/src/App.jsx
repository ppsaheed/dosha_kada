import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Admin from './pages/Admin';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

function App() {
  const [cart, setCart] = useState([]);
  const [deviceHash, setDeviceHash] = useState('');

  useEffect(() => {
    // Initialize FingerprintJS
    const setFp = async () => {
      const fp = await FingerprintJS.load();
      const { visitorId } = await fp.get();
      setDeviceHash(visitorId);
    };
    setFp();
  }, []);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prevCart, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === itemId);
      if (existingItem.qty > 1) {
        return prevCart.map((i) =>
          i.id === itemId ? { ...i, qty: i.qty - 1 } : i
        );
      }
      return prevCart.filter((i) => i.id !== itemId);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <Router>
      <div className="min-h-screen pb-20">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <header className="bg-white p-4 shadow-sm sticky top-0 z-10">
                  <div className="flex justify-between items-center max-w-md mx-auto">
                    <h1 className="text-xl font-bold text-gray-800">Dosha Kada</h1>
                    <Link to="/admin" className="text-sm text-gray-500">Admin</Link>
                  </div>
                </header>
                <main className="max-w-md mx-auto p-4">
                  <Menu addToCart={addToCart} removeFromCart={removeFromCart} cart={cart} />
                </main>
                {cart.length > 0 && (
                  <Cart cart={cart} clearCart={clearCart} deviceHash={deviceHash} />
                )}
              </>
            }
          />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
