'use client';

import { mockProducts } from '@/lib/mockData';
import ProductCard from './ProductCard';
import styles from './ProductGrid.module.css';

export default function ProductGrid() {
    return (
        <div className={styles.grid}>
            {mockProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
