'use client';

import { useParams, useRouter } from 'next/navigation';
import { useOrderStore } from '@/store/useOrderStore';
import { Sidebar } from '@/components/layout';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Truck, ShoppingBag, Phone, User, CheckCircle2 } from 'lucide-react';
import styles from './page.module.css';
import { useEffect, useState } from 'react';

export default function OrderDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const getOrderById = useOrderStore(state => state.getOrderById);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const order = getOrderById(id);

    if (!mounted) return null;

    if (!order) {
        return (
            <div className={styles.pageWrapper}>
                <Sidebar />
                <main className={styles.main}>
                    <div className={styles.errorContainer}>
                        <h1>Order Not Found</h1>
                        <p>We couldn't find the order with ID: {id}</p>
                        <Link href="/orders" className="btn btn-primary">Back to Orders</Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className={styles.pageWrapper}>
            <Sidebar />
            <main className={styles.main}>
                <div className="container">
                    <button onClick={() => router.back()} className={styles.backButton}>
                        <ArrowLeft size={18} /> Back
                    </button>

                    <header className={styles.header}>
                        <div className={styles.meta}>
                            <span className={styles.orderId}>Order #{order.id}</span>
                            <span className={styles.orderDate}>
                                <Calendar size={16} />
                                {new Date(order.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                        <div className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}>
                            {order.status}
                        </div>
                    </header>

                    <div className={styles.detailGrid}>
                        {/* Left: Items & Delivery */}
                        <div className={styles.mainContent}>
                            <section className={styles.section}>
                                <h3 className={styles.sectionTitle}>Order Items</h3>
                                <div className={styles.itemList}>
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className={styles.itemRow}>
                                            <div className={styles.itemThumb}>
                                                <Image src={item.image} alt={item.name} fill style={{ objectFit: 'contain' }} />
                                            </div>
                                            <div className={styles.itemInfo}>
                                                <h4 className={styles.itemName}>{item.name}</h4>
                                                <div className={styles.itemMeta}>
                                                    <span>Size: {item.size}</span>
                                                    {item.customization && (
                                                        <span className={styles.customText}>
                                                            {item.customization.name} #{item.customization.number}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className={styles.itemPriceSection}>
                                                <span className={styles.qty}>{item.quantity}x</span>
                                                <span className={styles.price}>{item.price.toLocaleString()} ETB</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className={styles.section}>
                                <h3 className={styles.sectionTitle}>Delivery Details</h3>
                                <div className={styles.deliveryCard}>
                                    <div className={styles.deliveryHeader}>
                                        {order.deliveryMethod === 'pickup' ? (
                                            <><ShoppingBag size={20} /> <span>Self Pickup</span></>
                                        ) : (
                                            <><Truck size={20} /> <span>Door Delivery</span></>
                                        )}
                                    </div>
                                    <div className={styles.deliveryContent}>
                                        <div className={styles.infoRow}>
                                            <User size={16} />
                                            <span>{order.customerInfo.fullName}</span>
                                        </div>
                                        <div className={styles.infoRow}>
                                            <Phone size={16} />
                                            <span>+251 {order.customerInfo.phone}</span>
                                        </div>
                                        <div className={styles.infoRow}>
                                            <MapPin size={16} />
                                            <span>
                                                {order.deliveryMethod === 'pickup'
                                                    ? `Collection Branch: ${order.customerInfo.branch}`
                                                    : `${order.customerInfo.area}, ${order.customerInfo.landmark}`
                                                }
                                                {order.customerInfo.houseNo && ` (House: ${order.customerInfo.houseNo})`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right: Payment Summary */}
                        <aside className={styles.sidebar}>
                            <div className={styles.summaryCard}>
                                <h3 className={styles.summaryTitle}>Payment Summary</h3>
                                <div className={styles.summaryTable}>
                                    <div className={styles.summaryRow}>
                                        <span>Subtotal</span>
                                        <span>{(order.total - (order.deliveryMethod === 'delivery' ? 200 : 0)).toLocaleString()} ETB</span>
                                    </div>
                                    <div className={styles.summaryRow}>
                                        <span>Delivery Fee</span>
                                        <span>{order.deliveryMethod === 'delivery' ? '200' : '0'} ETB</span>
                                    </div>
                                    <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                                        <span>Grand Total</span>
                                        <span className={styles.totalValue}>{order.total.toLocaleString()} ETB</span>
                                    </div>
                                </div>
                                <div className={styles.paymentMethod}>
                                    <span>Method:</span>
                                    <strong>Cash on Delivery/Collection</strong>
                                </div>
                            </div>

                            <div className={styles.helpBox}>
                                <h4>Need Help?</h4>
                                <p>If you have any questions regarding your order, please contact our support.</p>
                                <button className="btn btn-secondary">Contact Support</button>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </div>
    );
}
