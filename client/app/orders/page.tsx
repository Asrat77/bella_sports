'use client';

import { useOrderStore } from '@/store/useOrderStore';
import { Sidebar } from '@/components/layout';
import Link from 'next/link';
import { Package, Calendar, ArrowRight, ChevronRight } from 'lucide-react';
import styles from './page.module.css';
import { useEffect, useState } from 'react';

export default function OrdersPage() {
    const orders = useOrderStore(state => state.orders);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className={styles.pageWrapper}>
            <Sidebar />
            <main className={styles.main}>
                <div className="container">
                    <header className={styles.header}>
                        <h1 className={styles.title}>Your <span className="text-accent">Orders</span></h1>
                        <p className={styles.subtitle}>Track your latest kits and delivery status.</p>
                    </header>

                    {orders.length === 0 ? (
                        <div className={styles.emptyState}>
                            <Package size={64} className={styles.emptyIcon} />
                            <h2>No orders yet</h2>
                            <p>You haven't placed any orders yet. Start shopping to see them here!</p>
                            <Link href="/store" className="btn btn-primary">Go to Store</Link>
                        </div>
                    ) : (
                        <div className={styles.orderList}>
                            {orders.map((order) => (
                                <Link href={`/orders/${order.id}`} key={order.id} className={styles.orderCard}>
                                    <div className={styles.orderHeader}>
                                        <div className={styles.idGroup}>
                                            <span className={styles.orderId}>#{order.id}</span>
                                            <span className={styles.orderDate}>
                                                <Calendar size={14} />
                                                {new Date(order.date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className={styles.orderContent}>
                                        <div className={styles.itemSummary}>
                                            {order.items.map((item, idx) => (
                                                <span key={idx} className={styles.itemTag}>
                                                    {item.quantity}x {item.name} ({item.size})
                                                </span>
                                            ))}
                                        </div>
                                        <div className={styles.orderFooter}>
                                            <span className={styles.totalLabel}>Total Amount</span>
                                            <span className={styles.totalValue}>{order.total.toLocaleString()} ETB</span>
                                            <ChevronRight className={styles.chevron} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
