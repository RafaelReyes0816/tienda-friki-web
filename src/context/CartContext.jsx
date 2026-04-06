import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // RF-07: Agregar productos validando stock
  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // RF-08: Incrementar cantidad sin superar el stock
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          alert(`Lo sentimos, solo hay ${product.stock} unidades disponibles.`);
          return prevItems;
        }
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      } else {
        if (quantity > product.stock) {
          alert(`Lo sentimos, solo hay ${product.stock} unidades disponibles.`);
          return prevItems;
        }
        return [...prevItems, { ...product, quantity }];
      }
    });
  }, []);

  // RF-09: Modificar cantidad del producto en el carrito
  const updateQuantity = useCallback((productId, newQuantity) => {
    setCartItems(prevItems => {
      const item = prevItems.find(i => i.id === productId);
      if (!item) return prevItems;

      if (newQuantity > item.stock) {
        alert(`Lo sentimos, solo hay ${item.stock} unidades disponibles.`);
        return prevItems;
      }

      if (newQuantity <= 0) {
        return prevItems.filter(i => i.id !== productId);
      }

      return prevItems.map(i =>
        i.id === productId ? { ...i, quantity: newQuantity } : i
      );
    });
  }, []);

  // RF-09: Eliminar productos del carrito
  const removeFromCart = useCallback((productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('cart');
  }, []);

  // RF-10: Cálculo del total en tiempo real
  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.precio * item.quantity, 0);
  }, [cartItems]);

  // RF-11: Contador visible de productos
  const cartCount = useMemo(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount
  }), [cartItems, addToCart, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
