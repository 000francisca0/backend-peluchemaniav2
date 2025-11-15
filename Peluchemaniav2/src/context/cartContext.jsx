// src/context/cartContext.jsx
import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // --- FUNCIONES EXISTENTES ---
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const itemInCart = prevItems.find((item) => item.id === product.id);
      if (itemInCart) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (product) => {
    setCartItems((prevItems) => {
      const itemInCart = prevItems.find((item) => item.id === product.id);
      if (itemInCart.quantity === 1) {
        return prevItems.filter((item) => item.id !== product.id);
      } else {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
    });
  };

  // --- NUEVAS FUNCIONES ---

  // Función para ELIMINAR un item por completo, sin importar la cantidad
  const removeItem = (product) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== product.id));
  };

  // Función para VACIAR todo el carrito
  const clearCart = () => {
    setCartItems([]);
  };

  // Compartimos las nuevas funciones con el resto de la app
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};