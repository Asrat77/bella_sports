import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string; // unique ID for this specific kit (product + size + customization)
    productId: string;
    name: string;
    price: number;
    image: string;
    size: string;
    quantity: number;
    customization?: {
        name: string;
        number: string;
    };
}

interface CartStore {
    items: CartItem[];
    isCartOpen: boolean;
    addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: (open?: boolean) => void;
    getTotalPrice: () => number;
    getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isCartOpen: false,

            toggleCart: (open) => set({ isCartOpen: open !== undefined ? open : !get().isCartOpen }),

            addItem: (newItem) => {
                const items = get().items;
                const customizationKey = newItem.customization
                    ? `${newItem.customization.name}-${newItem.customization.number}`
                    : 'no-custom';

                const uniqueId = `${newItem.productId}-${newItem.size}-${customizationKey}`;

                const existingItem = items.find((item) => item.id === uniqueId);

                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            item.id === uniqueId
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    set({
                        items: [...items, { ...newItem, id: uniqueId, quantity: 1 }],
                    });
                }
            },

            removeItem: (id) => {
                set({
                    items: get().items.filter((item) => item.id !== id),
                });
            },

            updateQuantity: (id, quantity) => {
                if (quantity < 1) return;
                set({
                    items: get().items.map((item) =>
                        item.id === id ? { ...item, quantity } : item
                    ),
                });
            },

            clearCart: () => set({ items: [] }),

            getTotalPrice: () => {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
            },

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },
        }),
        {
            name: 'bellasport-cart',
        }
    )
);
