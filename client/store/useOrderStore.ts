import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from './useCartStore';

export interface Order {
    id: string;
    items: CartItem[];
    total: number;
    date: string;
    status: 'Pending' | 'Confirmed' | 'Delivered';
    deliveryMethod: 'pickup' | 'delivery';
    customerInfo: {
        fullName: string;
        phone: string;
        branch?: string;
        area?: string;
        landmark?: string;
        houseNo?: string;
    };
}

interface OrderStore {
    orders: Order[];
    addOrder: (order: Order) => void;
    updateOrder: (id: string, updates: Partial<Order>) => void;
    deleteOrder: (id: string) => void;
    getOrderById: (id: string) => Order | undefined;
}

export const useOrderStore = create<OrderStore>()(
    persist(
        (set, get) => ({
            orders: [],
            addOrder: (order) => set({ orders: [order, ...get().orders] }),
            updateOrder: (id, updates) => set({
                orders: get().orders.map(o => o.id === id ? { ...o, ...updates } : o)
            }),
            deleteOrder: (id) => set({
                orders: get().orders.filter(o => o.id !== id)
            }),
            getOrderById: (id) => get().orders.find(o => o.id === id),
        }),
        {
            name: 'bellasport-orders',
        }
    )
);
