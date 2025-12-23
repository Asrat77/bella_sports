'use client';

import { useOrderStore, Order } from '@/store/useOrderStore';
import {
    Search,
    Filter,
    MoreVertical,
    Eye,
    Truck,
    CheckCircle2,
    Clock,
    User,
    Calendar,
    ArrowUpRight,
    ShoppingBag
} from 'lucide-react';
import styles from './page.module.css';
import { useState, useEffect } from 'react';
import OrderDetailModal from '@/components/admin/OrderDetailModal';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Delivered'];

export default function AdminOrders() {
    const { orders, updateOrder } = useOrderStore();
    const [search, setSearch] = useState('');
    const [mounted, setMounted] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const filtered = orders.filter(o =>
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customerInfo.fullName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={styles.orders}>
            <header className={styles.header}>
                <div className={styles.titleInfo}>
                    <h1>Store Orders</h1>
                    <p>{orders.length} orders total</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.exportBtn}>Export CSV</button>
                </div>
            </header>

            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Search by ID or customer name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className={styles.filters}>
                    <button className={styles.toolBtn}><Clock size={14} /> Pending Only</button>
                    <button className={styles.toolBtn}><Filter size={14} /> More Filters</button>
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>OrderID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Price</th>
                            <th>Delivery</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((order) => (
                            <tr key={order.id}>
                                <td className={styles.mono}>
                                    <div className={styles.idCell}>
                                        <span>#{order.id}</span>
                                        <ArrowUpRight size={12} className={styles.linkIcon} />
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.customerCell}>
                                        <div className={styles.avatar}>
                                            {order.customerInfo.fullName[0].toUpperCase()}
                                        </div>
                                        <div className={styles.customerInfo}>
                                            <span className={styles.customerName}>{order.customerInfo.fullName}</span>
                                            <span className={styles.customerPhone}>+251 {order.customerInfo.phone}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.dateCell}>
                                        <Calendar size={12} />
                                        <span>{new Date(order.date).toLocaleDateString()}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.itemsCell}>
                                        <span className={styles.itemCount}>{order.items.reduce((s, i) => s + i.quantity, 0)} Items</span>
                                        <div className={styles.summaryList}>
                                            {order.items.slice(0, 2).map((it, idx) => (
                                                <span key={idx}>{it.name}{idx === 0 && order.items.length > 1 ? ', ' : ''}</span>
                                            ))}
                                            {order.items.length > 2 && '...'}
                                        </div>
                                    </div>
                                </td>
                                <td className={styles.mono}>
                                    {order.total.toLocaleString()} ETB
                                </td>
                                <td>
                                    <div className={styles.methodCell}>
                                        {order.deliveryMethod === 'pickup' ? (
                                            <><ShoppingBag size={14} /> Pickup</>
                                        ) : (
                                            <><Truck size={14} /> Door</>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <select
                                        className={`${styles.select} ${styles[order.status.toLowerCase()]}`}
                                        value={order.status}
                                        onChange={(e) => updateOrder(order.id, { status: e.target.value as Order['status'] })}
                                    >
                                        {STATUS_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <button
                                        className={styles.iconBtn}
                                        title="View Details"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onStatusUpdate={(id, status) => {
                        updateOrder(id, { status });
                        setSelectedOrder(prev => prev ? { ...prev, status } : null);
                    }}
                />
                {filtered.length === 0 && (
                    <div className={styles.empty}>
                        <Search size={48} className={styles.emptyIcon} />
                        <h3>No orders found</h3>
                        <p>Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
