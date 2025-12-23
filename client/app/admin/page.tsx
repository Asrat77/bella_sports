'use client';

import { useOrderStore } from '@/store/useOrderStore';
import { mockProducts } from '@/lib/mockData';
import {
    Users,
    ShoppingBag,
    DollarSign,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Clock,
    Boxes
} from 'lucide-react';
import styles from './page.module.css';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
    const orders = useOrderStore(state => state.orders);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const itemsInStock = mockProducts.length;

    const stats = [
        { label: 'Total Revenue', value: `${totalRevenue.toLocaleString()} ETB`, icon: DollarSign, color: '#FFD700', trend: '+12%' },
        { label: 'Active Orders', value: orders.length, icon: ShoppingBag, color: '#4CAF50', trend: '+5' },
        { label: 'Pending Action', value: pendingOrders, icon: Clock, color: '#FF9800', trend: 'Critical' },
        { label: 'Live Products', value: itemsInStock, icon: Boxes, color: '#2196F3' }
    ];

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <h1>Dashboard Overview</h1>
                <p>Real-time analytics and store status.</p>
            </header>

            <div className={styles.statsGrid}>
                {stats.map((stat, i) => {
                    const Icon = stat.icon || Boxes;
                    return (
                        <div key={i} className={styles.statCard}>
                            <div className={styles.statInfo}>
                                <span className={styles.statLabel}>{stat.label}</span>
                                <span className={styles.statValue}>{stat.value}</span>
                                {stat.trend && (
                                    <span className={`${styles.statTrend} ${stat.trend === 'Critical' ? styles.negative : styles.positive}`}>
                                        {stat.trend}
                                    </span>
                                )}
                            </div>
                            <div className={styles.statIcon} style={{ color: stat.color, background: `${stat.color}15` }}>
                                <Icon size={24} />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={styles.bottomGrid}>
                {/* Recent Orders Table */}
                <div className={styles.recentOrders}>
                    <div className={styles.sectionHeader}>
                        <h3>Recent Orders</h3>
                        <button className={styles.viewAll}>View All</button>
                    </div>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>OrderID</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.slice(0, 5).map((order) => (
                                    <tr key={order.id}>
                                        <td className={styles.mono}>#{order.id}</td>
                                        <td>{order.customerInfo.fullName}</td>
                                        <td className={styles.mono}>{order.total.toLocaleString()}</td>
                                        <td>
                                            <span className={`${styles.badge} ${styles[order.status.toLowerCase()]}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--text-muted)' }}>
                                            No orders to display.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* System Health / Quick Logs */}
                <div className={styles.sysLog}>
                    <h3 className={styles.sectionHeader}>System Logs</h3>
                    <div className={styles.logList}>
                        <div className={styles.logItem}>
                            <CheckCircle2 size={14} color="#4CAF50" />
                            <span>Inventory DB connected successfully</span>
                            <span className={styles.timestamp}>2m ago</span>
                        </div>
                        <div className={styles.logItem}>
                            <AlertCircle size={14} color="#FF9800" />
                            <span>Low stock warning: Addis Ababa Home Kit</span>
                            <span className={styles.timestamp}>15m ago</span>
                        </div>
                        <div className={styles.logItem}>
                            <Clock size={14} color="var(--text-muted)" />
                            <span>New order #BS-8824 synced</span>
                            <span className={styles.timestamp}>1h ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
