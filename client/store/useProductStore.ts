import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, mockProducts as initialProducts } from '@/lib/mockData';

interface ProductStore {
    products: Product[];
    addProduct: (product: Product) => void;
    updateProduct: (id: string, updates: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductStore>()(
    persist(
        (set, get) => ({
            products: initialProducts,
            addProduct: (product) => set({ products: [product, ...get().products] }),
            updateProduct: (id, updates) => set({
                products: get().products.map(p => p.id === id ? { ...p, ...updates } : p)
            }),
            deleteProduct: (id) => set({
                products: get().products.filter(p => p.id !== id)
            }),
        }),
        {
            name: 'bellasport-products',
        }
    )
);
