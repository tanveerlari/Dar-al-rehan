import { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((product) => {
    setToast(product);
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.type === product.type && item.id === product.id
      );
      if (existing) {
        return prev.map((item) =>
          item.type === product.type && item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
    showToast(product);
  };

  const removeFromCart = (type, id) => {
    setCartItems((prev) => prev.filter((item) => !(item.type === type && item.id === id)));
  };

  const updateQuantity = (type, id, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (item.type === type && item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal, toast, hideToast }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}