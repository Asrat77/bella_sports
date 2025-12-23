'use client';

import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout';
import { mockProducts } from '@/lib/mockData';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import styles from './page.module.css';

export default function ProductDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const product = mockProducts.find((p) => p.id === id);

    const [selectedSize, setSelectedSize] = useState('M');
    const [personalize, setPersonalize] = useState(false);
    const [customName, setCustomName] = useState('');
    const [customNumber, setCustomNumber] = useState('');
    const { addItem, toggleCart } = useCartStore();

    if (!product) {
        return (
            <div className={styles.errorContainer}>
                <h1>Product Not Found</h1>
                <Link href="/store" className="btn btn-primary">Back to Store</Link>
            </div>
        );
    }

    const handleAddToCart = () => {
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price + (personalize ? 500 : 0),
            image: product.image,
            size: selectedSize,
            customization: personalize ? { name: customName, number: customNumber } : undefined,
        });
        toggleCart(true);
    };

    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

    return (
        <div className={styles.pageWrapper}>
            <Sidebar />
            <main className={styles.main}>
                <div className="container">
                    <button onClick={() => router.back()} className={styles.backButton}>
                        ← Back to Store
                    </button>

                    <div className={styles.detailGrid}>
                        {/* Left: Image Gallery */}
                        <div className={styles.imageSection}>
                            <div className={styles.mainImageContainer}>
                                <Image
                                    src={personalize && product.backImage ? product.backImage : product.image}
                                    alt={product.name}
                                    fill
                                    className={styles.mainImage}
                                    priority
                                    style={{ objectFit: 'contain' }}
                                />

                                {/* Live Preview Overlay (Upper Back) */}
                                {personalize && (customName || customNumber) && (
                                    <div className={`${styles.customPreview} ${personalize ? styles.showBack : ''}`}>
                                        <div className={styles.previewName}>{customName}</div>
                                        <div className={styles.previewNumber}>{customNumber}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Info & Options */}
                        <div className={styles.infoSection}>
                            <div className={styles.header}>
                                <span className={styles.category}>{product.category}</span>
                                <h1 className={styles.title}>{product.name}</h1>
                                <div className={styles.price}>{product.price.toLocaleString()} ETB</div>
                            </div>

                            <div className={styles.description}>
                                <p>
                                    Authentic match-day kit as worn by the pros. Breathable moisture-wicking fabric
                                    designed for maximum performance on the pitch and premium style on the streets.
                                </p>
                            </div>

                            {/* Size Selection */}
                            <div className={styles.optionGroup}>
                                <h3 className={styles.optionLabel}>Select Size</h3>
                                <div className={styles.sizeGrid}>
                                    {sizes.map((size) => (
                                        <button
                                            key={size}
                                            className={`${styles.sizeButton} ${selectedSize === size ? styles.selectedSize : ''}`}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Personalization */}
                            <div className={styles.optionGroup}>
                                <div className={styles.personalizeHeader}>
                                    <h3 className={styles.optionLabel}>Personalization</h3>
                                    <label className={styles.toggle}>
                                        <input
                                            type="checkbox"
                                            checked={personalize}
                                            onChange={(e) => setPersonalize(e.target.checked)}
                                        />
                                        <span className={styles.slider}></span>
                                    </label>
                                </div>

                                {personalize && (
                                    <div className={styles.personalizeFields}>
                                        <div className={styles.inputField}>
                                            <label>Name</label>
                                            <input
                                                type="text"
                                                maxLength={12}
                                                placeholder="e.g. SALAH"
                                                value={customName}
                                                onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                                            />
                                        </div>
                                        <div className={styles.inputField}>
                                            <label>Number</label>
                                            <input
                                                type="text"
                                                maxLength={2}
                                                placeholder="11"
                                                value={customNumber}
                                                onChange={(e) => setCustomNumber(e.target.value.replace(/\D/g, ''))}
                                            />
                                        </div>
                                        <p className={styles.hint}>+500 ETB for customization</p>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className={styles.actions}>
                                <button
                                    className={`btn btn-primary ${styles.addToCart}`}
                                    onClick={handleAddToCart}
                                >
                                    Add to Cart — {(product.price + (personalize ? 500 : 0)).toLocaleString()} ETB
                                </button>
                            </div>

                            {/* Shipping info */}
                            <div className={styles.shippingInfo}>
                                <span>🚚 Fast Delivery in Addis Ababa (24h)</span>
                                <span>🛡️ 100% Authentic Product</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
