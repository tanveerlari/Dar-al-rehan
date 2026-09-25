import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { rateLimiter } from "../utils/rateLimiter";

const CartContext = createContext();
const STORAGE_KEY = "dar-al-rehan-cart";
const getProductKey = (product) => `${product.routeType || product.type}-${product.id}`;

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const showToast = useCallback((product) => {
    setToast(product);
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const addToCart = (product, qty = 1) => {
    // 🛡️ Rate limit check
    const check = rateLimiter.check("addToCart");
    if (!check.allowed) {
      console.warn("Rate limited: addToCart blocked");
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find(
        (item) => getProductKey(item) === getProductKey(product)
      );
      if (existing) {
        return prev.map((item) =>
          getProductKey(item) === getProductKey(product)
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
    showToast(product);
  };

  const removeFromCart = (type, id) => {
    setCartItems((prev) => prev.filter((item) => getProductKey(item) !== `${type}-${id}`));
  };

  const updateQuantity = (type, id, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (getProductKey(item) === `${type}-${id}` ? { ...item, quantity } : item))
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