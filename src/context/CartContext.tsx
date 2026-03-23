"use client";

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import type { MenuItem, HomeCook } from "@/data/restaurants";

export interface CartItem extends MenuItem {
  quantity: number;
  cookId: string;
  kitchenName: string;
}

interface CartContextType {
  items: CartItem[];
  cookId: string | null;
  kitchenName: string | null;
  addItem: (item: MenuItem, cook: HomeCook) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cookId, setCookId] = useState<string | null>(null);
  const [kitchenName, setKitchenName] = useState<string | null>(null);
  const [deliveryFee, setDeliveryFee] = useState(0);

  const addItem = useCallback(
    (item: MenuItem, cook: HomeCook) => {
      if (cookId && cookId !== cook.id) {
        const confirmed = window.confirm(
          `Your cart has items from ${kitchenName}. Do you want to clear the cart and add items from ${cook.kitchenName}?`
        );
        if (!confirmed) return;
        setItems([]);
      }

      setCookId(cook.id);
      setKitchenName(cook.kitchenName);
      setDeliveryFee(cook.deliveryFee);

      setItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        return [
          ...prev,
          { ...item, quantity: 1, cookId: cook.id, kitchenName: cook.kitchenName },
        ];
      });
    },
    [cookId, kitchenName]
  );

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== itemId);
      if (next.length === 0) {
        setCookId(null);
        setKitchenName(null);
        setDeliveryFee(0);
      }
      return next;
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    setCookId(null);
    setKitchenName(null);
    setDeliveryFee(0);
  }, []);

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);
  const total = useMemo(() => subtotal + (items.length > 0 ? deliveryFee : 0), [subtotal, items.length, deliveryFee]);

  const value = useMemo(() => ({
    items, cookId, kitchenName, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal, deliveryFee, total,
  }), [items, cookId, kitchenName, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal, deliveryFee, total]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
