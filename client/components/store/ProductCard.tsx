'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/mockData';
import styles from './ProductCard.module.css';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={`/store/${product.id}`} className={styles.card}>
            <div className={styles.imageContainer}>
                {/* Badges */}
                {product.isNew && <span className={`${styles.badge} ${styles.badgeNew}`}>New</span>}
                {product.isBestSeller && <span className={`${styles.badge} ${styles.badgeHot}`}>Best Seller</span>}

                {/* Product Image */}
                <div className={styles.imageWrapper}>
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className={styles.productImage}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'contain' }}
                    />
                </div>
            </div>

            <div className={styles.details}>
                <span className={styles.league}>{product.league}</span>
                <h3 className={styles.name}>{product.name}</h3>
                <div className={styles.footer}>
                    <span className={styles.price}>{product.price.toLocaleString()} ETB</span>
                    <span className={styles.action}>Customize →</span>
                </div>
            </div>
        </Link>
    );
}
