"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  id: string;
  quantity: number;
}

interface OrderState {
  sender: string;
  isAnonymous: boolean;
  recipient: string;
  relationship: string;
  destination: string;
  items: Record<string, number>;
  message: string;
}

interface OrderContextType {
  state: OrderState;
  updateState: (updates: Partial<OrderState>) => void;
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  decreaseItem: (id: string) => void;
  cartTotalItems: number;
}

const initialState: OrderState = {
  sender: "",
  isAnonymous: false,
  recipient: "",
  relationship: "",
  destination: "",
  items: {},
  message: "",
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OrderState>(initialState);

  const updateState = (updates: Partial<OrderState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const addItem = (id: string) => {
    setState((prev) => ({
      ...prev,
      items: {
        ...prev.items,
        [id]: (prev.items[id] || 0) + 1,
      },
    }));
  };

  const decreaseItem = (id: string) => {
    setState((prev) => {
      const currentQty = prev.items[id] || 0;
      if (currentQty <= 1) {
        const newItems = { ...prev.items };
        delete newItems[id];
        return { ...prev, items: newItems };
      }
      return {
        ...prev,
        items: {
          ...prev.items,
          [id]: currentQty - 1,
        },
      };
    });
  };

  const removeItem = (id: string) => {
    setState((prev) => {
      const newItems = { ...prev.items };
      delete newItems[id];
      return { ...prev, items: newItems };
    });
  };

  const cartTotalItems = Object.values(state.items).reduce((a, b) => a + b, 0);

  return (
    <OrderContext.Provider value={{ state, updateState, addItem, removeItem, decreaseItem, cartTotalItems }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
}
