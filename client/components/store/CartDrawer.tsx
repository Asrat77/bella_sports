'use client';

import { useCartStore, CartItem } from '@/store/useCartStore';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './CartDrawer.module.css';
import { useEffect, useState } from 'react';

export default function CartDrawer() {
    const { items, isCartOpen, toggleCart, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();
    const [mounted, setMounted] = useState(false);

    // Persistence fix for hydration
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`${styles.backdrop} ${isCartOpen ? styles.backdropVisible : ''}`}
                onClick={() => toggleCart(false)}
            />

            {/* Drawer */}
            <aside className={`${styles.drawer} ${isCartOpen ? styles.drawerOpen : ''}`}>
                <div className={styles.header}>
                    <div className={styles.headerTitle}>
                        <ShoppingBag size={20} />
                        <h2>Your Cart ({getTotalItems()})</h2>
                    </div>
                    <button className={styles.closeButton} onClick={() => toggleCart(false)}>
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.content}>
                    {items.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>👕</div>
                            <h3>Your cart is empty</h3>
                            <p>Premium kits are waiting for you.</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => toggleCart(false)}
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        <div className={styles.itemList}>
                            {items.map((item) => (
                                <CartItemRow key={item.id} item={item} updateQuantity={updateQuantity} removeItem={removeItem} />
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className={styles.footer}>
                        <div className={styles.totals}>
                            <span>Subtotal</span>
                            <span className={styles.totalPrice}>{getTotalPrice().toLocaleString()} ETB</span>
                        </div>
                        <p className={styles.shippingNote}>Shipping calculated at checkout.</p>
                        <Link
                            href="/checkout"
                            className={`btn btn-primary ${styles.checkoutButton}`}
                            onClick={() => toggleCart(false)}
                        >
                            Checkout Now
                        </Link>
                    </div>
                )}
            </aside>
        </>
    );
}

function CartItemRow({ item, updateQuantity, removeItem }: {
    item: CartItem,
    updateQuantity: (id: string, q: number) => void,
    removeItem: (id: string) => void
}) {
    return (
        <div className={styles.itemRow}>
            <div className={styles.itemImage}>
                <Image src={item.image} alt={item.name} fill style={{ objectFit: 'contain' }} />
            </div>

            <div className={styles.itemInfo}>
                <div className={styles.itemHeader}>
                    <h4 className={styles.itemName}>{item.name}</h4>
                    <button className={styles.removeAction} onClick={() => removeItem(item.id)}>
                        <Trash2 size={14} />
                    </button>
                </div>

                <div className={styles.itemMeta}>
                    <span className={styles.itemSize}>Size: {item.size}</span>
                    {item.customization && (
                        <span className={styles.itemCustom}>
                            {item.customization.name} #{item.customization.number}
                        </span>
                    )}
                </div>

                <div className={styles.itemFooter}>
                    <div className={styles.quantityControls}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus size={12} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus size={12} />
                        </button>
                    </div>
                    <span className={styles.itemPrice}>{(item.price * item.quantity).toLocaleString()} ETB</span>
                </div>
            </div>
        </div>
    );
}
