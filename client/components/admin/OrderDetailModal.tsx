'use client';

import { X, User, Phone, MapPin, Truck, ShoppingBag, Calendar } from 'lucide-react';
import styles from './OrderDetailModal.module.css';
import { Order } from '@/store/useOrderStore';
import Image from 'next/image';

interface OrderDetailModalProps {
    order: Order | null;
    onClose: () => void;
    onStatusUpdate: (id: string, status: Order['status']) => void;
}

export default function OrderDetailModal({ order, onClose, onStatusUpdate }: OrderDetailModalProps) {
    if (!order) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <header className={styles.header}>
                    <div className={styles.titleGroup}>
                        <h2>Order <span className="text-accent">#{order.id}</span></h2>
                        <span className={styles.date}>
                            <Calendar size={14} />
                            {new Date(order.date).toLocaleDateString()}
                        </span>
                    </div>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <X size={20} />
                    </button>
                </header>

                <div className={styles.content}>
                    {/* Customer Info */}
                    <section className={styles.section}>
                        <h3>Customer Information</h3>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoRow}>
                                <User size={16} />
                                <div>
                                    <label>Full Name</label>
                                    <p>{order.customerInfo.fullName}</p>
                                </div>
                            </div>
                            <div className={styles.infoRow}>
                                <Phone size={16} />
                                <div>
                                    <label>Phone Number</label>
                                    <p>+251 {order.customerInfo.phone}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Delivery Info */}
                    <section className={styles.section}>
                        <h3>Delivery Details</h3>
                        <div className={styles.deliveryCard}>
                            <div className={styles.method}>
                                {order.deliveryMethod === 'pickup' ? <ShoppingBag size={18} /> : <Truck size={18} />}
                                <span>{order.deliveryMethod === 'pickup' ? 'Self Pickup' : 'Door Delivery'}</span>
                            </div>
                            <p className={styles.address}>
                                <MapPin size={16} />
                                {order.deliveryMethod === 'pickup'
                                    ? `Branch: ${order.customerInfo.branch}`
                                    : `${order.customerInfo.area}, ${order.customerInfo.landmark} (House: ${order.customerInfo.houseNo || 'N/A'})`
                                }
                            </p>
                        </div>
                    </section>

                    {/* Items */}
                    <section className={styles.section}>
                        <h3>Items Ordered</h3>
                        <div className={styles.itemList}>
                            {order.items.map((item, idx) => (
                                <div key={idx} className={styles.itemRow}>
                                    <div className={styles.thumb}>
                                        <Image src={item.image} alt="" fill style={{ objectFit: 'contain' }} />
                                    </div>
                                    <div className={styles.itemMeta}>
                                        <p className={styles.itemName}>{item.name}</p>
                                        <p className={styles.itemDetails}>
                                            Size: {item.size} | Qty: {item.quantity}
                                            {item.customization && ` | ${item.customization.name} #${item.customization.number}`}
                                        </p>
                                    </div>
                                    <span className={styles.itemPrice}>{(item.price * item.quantity).toLocaleString()} ETB</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Total */}
                    <div className={styles.totalRow}>
                        <span>Total Amount</span>
                        <span className={styles.totalValue}>{order.total.toLocaleString()} ETB</span>
                    </div>

                    {/* Status Management */}
                    <div className={styles.statusActions}>
                        <label>Update Status</label>
                        <div className={styles.btnGroup}>
                            {['Pending', 'Confirmed', 'Delivered'].map((status) => (
                                <button
                                    key={status}
                                    className={`${styles.statusBtn} ${order.status === status ? styles.active : ''}`}
                                    onClick={() => onStatusUpdate(order.id, status as Order['status'])}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
