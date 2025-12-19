import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, Size } from '@prisma/client';

// Define delivery method type
export type DeliveryMethod = 'standard' | 'express' | 'pickup' | 'us';

// Define the shape of an item in the cart
export interface CartItem extends Product {
  selectedSize: string;
  quantity: number;
  // Max units allowed for this item+size (based on stock at time of add).
  // Used to prevent the UI from exceeding available stock via repeated adds/edits.
  maxAvailable?: number;
}

// Define the shape of the store's state and actions
interface CartStore {
  items: CartItem[];
  deliveryMethod: DeliveryMethod;
  addItem: (product: Product, size: string, quantity?: number, maxAvailable?: number) => void;
  setQuantity: (productId: string, size: string, quantity: number) => void;
  removeItem: (productId: string, size: string) => void;
  clearCart: () => void;
  setDeliveryMethod: (method: DeliveryMethod) => void;
}

export const useCart = create(
  // Use 'persist' middleware to save the cart to localStorage
  persist<CartStore>((set, get) => ({
    items: [],
    deliveryMethod: 'standard' as DeliveryMethod,

    addItem: (product, size, quantity = 1, maxAvailable) => {
      const qty = Number.isFinite(quantity) ? Math.max(1, Math.floor(quantity)) : 1;
      const currentItems = get().items;
      // Check if the exact product with the same size already exists
      const existingItem = currentItems.find(
        (item) => item.id === product.id && item.selectedSize === size
      );

      if (existingItem) {
        const cap = typeof maxAvailable === "number" ? Math.max(0, Math.floor(maxAvailable)) : existingItem.maxAvailable;
        const nextQty = cap != null ? Math.min(existingItem.quantity + qty, cap) : existingItem.quantity + qty;

        // If it exists, just increase the quantity
        set({
          items: currentItems.map((item) =>
            item.id === product.id && item.selectedSize === size
              ? { ...item, quantity: nextQty, maxAvailable: cap ?? item.maxAvailable }
              : item
          ),
        });
      } else {
        const cap = typeof maxAvailable === "number" ? Math.max(0, Math.floor(maxAvailable)) : undefined;
        const initialQty = cap != null ? Math.min(qty, cap) : qty;
        // If it's a new item, add it to the cart
        set({
          items: [...currentItems, { ...product, selectedSize: size, quantity: initialQty, maxAvailable: cap }],
        });
      }
      
      console.log("Item added to cart!");
    },

    setQuantity: (productId, size, quantity) => {
      const qty = Number.isFinite(quantity) ? Math.max(0, Math.floor(quantity)) : 0;
      if (qty <= 0) {
        set({
          items: get().items.filter((item) => !(item.id === productId && item.selectedSize === size)),
        });
        return;
      }

      const current = get().items.find((item) => item.id === productId && item.selectedSize === size);
      const cap = current?.maxAvailable;
      const nextQty = cap != null ? Math.min(qty, cap) : qty;

      set({
        items: get().items.map((item) =>
          item.id === productId && item.selectedSize === size ? { ...item, quantity: nextQty } : item
        ),
      });
    },

    removeItem: (productId, size) => {
      set({
        items: get().items.filter(
          (item) => !(item.id === productId && item.selectedSize === size)
        ),
      });
    },

    clearCart: () => set({ items: [] }),

    setDeliveryMethod: (method: DeliveryMethod) => {
      set({ deliveryMethod: method });
    },
  }), {
    name: 'cart-storage', // The key in localStorage
    storage: createJSONStorage(() => localStorage),
  })
);