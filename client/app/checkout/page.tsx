'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout';
import { useCartStore } from '@/store/useCartStore';
import { useOrderStore, Order } from '@/store/useOrderStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Truck, ShoppingBag, CheckCircle2, Phone, User, MapPinned } from 'lucide-react';
import confetti from 'canvas-confetti';
import styles from './page.module.css';

const BRANCHES = ['Bole (Edna Mall Area)', 'Piassa (Near Cinema Africa)', 'Megenagna (Metebaber Building)'];

export default function CheckoutPage() {
    const { items, getTotalPrice, clearCart } = useCartStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    // Form State
    const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('delivery');
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        branch: BRANCHES[0],
        area: '',
        landmark: '',
        houseNo: '',
        notes: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [lastOrderId, setLastOrderId] = useState('');
    const addOrder = useOrderStore(state => state.addOrder);

    useEffect(() => {
        setMounted(true);
        if (mounted && items.length === 0 && !isSuccess) {
            router.push('/store');
        }
    }, [mounted, items, router, isSuccess]);

    if (!mounted || (items.length === 0 && !isSuccess)) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        const orderId = `BS-${Math.floor(1000 + Math.random() * 9000)}`;
        setLastOrderId(orderId);

        const newOrder: Order = {
            id: orderId,
            items: [...items],
            total: getTotalPrice() + (deliveryMethod === 'delivery' ? 200 : 0),
            date: new Date().toISOString(),
            status: 'Pending',
            deliveryMethod: deliveryMethod,
            customerInfo: {
                fullName: formData.fullName,
                phone: formData.phone,
                branch: deliveryMethod === 'pickup' ? formData.branch : undefined,
                area: deliveryMethod === 'delivery' ? formData.area : undefined,
                landmark: deliveryMethod === 'delivery' ? formData.landmark : undefined,
                houseNo: deliveryMethod === 'delivery' ? formData.houseNo : undefined,
            }
        };

        addOrder(newOrder);
        setIsSubmitting(false);
        setIsSuccess(true);
        clearCart();

        // Trigger Confetti
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    if (isSuccess) {
        return (
            <div className={styles.pageWrapper}>
                <Sidebar />
                <main className={styles.main}>
                    <div className={styles.successContainer}>
                        <div className={styles.successCard}>
                            <CheckCircle2 size={80} className={styles.successIcon} />
                            <h1>Order Placed!</h1>
                            <p>Thank you for choosing Bellasport. We've received your order and will contact you shortly to confirm.</p>
                            <Link href={`/orders/${lastOrderId}`} className={styles.orderNumber}>
                                Order #{lastOrderId}
                            </Link>
                            <div className={styles.successActions}>
                                <button onClick={() => router.push('/')} className="btn btn-secondary">Return Home</button>
                                <button onClick={() => router.push('/store')} className="btn btn-primary">Keep Shopping</button>
                            </div>
                        </div>
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
                    <header className={styles.header}>
                        <h1 className={styles.title}>Confirm Your <span className="text-accent">Order</span></h1>
                        <p className={styles.subtitle}>Complete your details to finalize the purchase.</p>
                    </header>

                    <div className={styles.checkoutGrid}>
                        {/* Left: Checkout Form */}
                        <form className={styles.formSection} onSubmit={handleSubmit}>
                            {/* Contact Info */}
                            <section className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <User size={20} />
                                    <h3>Contact Information</h3>
                                </div>
                                <div className={styles.inputGrid}>
                                    <div className={styles.inputGroup}>
                                        <label>Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Enter your name"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Phone Number</label>
                                        <div className={styles.phoneInput}>
                                            <span>+251</span>
                                            <input
                                                type="tel"
                                                required
                                                placeholder="911223344"
                                                pattern="[0-9]{9}"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Delivery Method */}
                            <section className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <Truck size={20} />
                                    <h3>Delivery Method</h3>
                                </div>
                                <div className={styles.methodGrid}>
                                    <label className={`${styles.methodCard} ${deliveryMethod === 'delivery' ? styles.methodActive : ''}`}>
                                        <input
                                            type="radio"
                                            name="deliveryMethod"
                                            value="delivery"
                                            checked={deliveryMethod === 'delivery'}
                                            onChange={() => setDeliveryMethod('delivery')}
                                        />
                                        <Truck className={styles.methodIcon} />
                                        <div className={styles.methodInfo}>
                                            <span className={styles.methodLabel}>Door Delivery</span>
                                            <span className={styles.methodDesc}>Addis Ababa (24h)</span>
                                        </div>
                                        <span className={styles.methodPrice}>+200 ETB</span>
                                    </label>

                                    <label className={`${styles.methodCard} ${deliveryMethod === 'pickup' ? styles.methodActive : ''}`}>
                                        <input
                                            type="radio"
                                            name="deliveryMethod"
                                            value="pickup"
                                            checked={deliveryMethod === 'pickup'}
                                            onChange={() => setDeliveryMethod('pickup')}
                                        />
                                        <ShoppingBag className={styles.methodIcon} />
                                        <div className={styles.methodInfo}>
                                            <span className={styles.methodLabel}>Self Pickup</span>
                                            <span className={styles.methodDesc}>Collect at branch</span>
                                        </div>
                                        <span className={styles.methodPrice}>Free</span>
                                    </label>
                                </div>

                                {/* Conditional Fields */}
                                <div className={styles.conditionalSection}>
                                    {deliveryMethod === 'pickup' ? (
                                        <div className={styles.inputGroup}>
                                            <label>Select Branch</label>
                                            <div className={styles.selectWrapper}>
                                                <MapPin className={styles.selectIcon} />
                                                <select
                                                    value={formData.branch}
                                                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                                >
                                                    {BRANCHES.map(branch => (
                                                        <option key={branch} value={branch}>{branch}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={styles.addressForm}>
                                            <div className={styles.inputGroup}>
                                                <label>Area / Neighborhood</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="e.g. Bole Atlas, Lebu, Old Airport"
                                                    value={formData.area}
                                                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                                />
                                            </div>
                                            <div className={styles.addrLine}>
                                                <div className={styles.inputGroup}>
                                                    <label>Landmark / Big Building</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="e.g. Opposite Edna Mall"
                                                        value={formData.landmark}
                                                        onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                                                    />
                                                </div>
                                                <div className={styles.inputGroup}>
                                                    <label>House/Apt No.</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Optional"
                                                        value={formData.houseNo}
                                                        onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className={styles.inputGroup}>
                                                <label>Delivery Notes</label>
                                                <textarea
                                                    placeholder="Gate color, specific instructions..."
                                                    value={formData.notes}
                                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>

                            <button
                                type="submit"
                                className={`btn btn-primary ${styles.submitBtn}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Processing...' : `Place Order — ${(getTotalPrice() + (deliveryMethod === 'delivery' ? 200 : 0)).toLocaleString()} ETB`}
                            </button>
                        </form>

                        {/* Right: Order Summary */}
                        <aside className={styles.summarySection}>
                            <div className={styles.summaryCard}>
                                <h3 className={styles.summaryTitle}>Order Summary</h3>
                                <div className={styles.summaryList}>
                                    {items.map(item => (
                                        <div key={item.id} className={styles.summaryItem}>
                                            <div className={styles.itemThumb}>
                                                <Image src={item.image} alt={item.name} fill style={{ objectFit: 'contain' }} />
                                            </div>
                                            <div className={styles.itemInfo}>
                                                <span className={styles.itemName}>{item.name}</span>
                                                <span className={styles.itemDetails}>
                                                    Size {item.size} {item.customization && `| ${item.customization.name} #${item.customization.number}`}
                                                </span>
                                                <span className={styles.itemQty}>Qty: {item.quantity}</span>
                                            </div>
                                            <span className={styles.itemPrice}>{(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.summaryTotals}>
                                    <div className={styles.summaryRow}>
                                        <span>Subtotal</span>
                                        <span className={styles.priceValue}>{getTotalPrice().toLocaleString()} ETB</span>
                                    </div>
                                    <div className={styles.summaryRow}>
                                        <span>Delivery</span>
                                        <span className={styles.priceValue}>{deliveryMethod === 'delivery' ? '200' : '0'} ETB</span>
                                    </div>
                                    <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                                        <span>Total</span>
                                        <span className={styles.totalValue}>{(getTotalPrice() + (deliveryMethod === 'delivery' ? 200 : 0)).toLocaleString()} ETB</span>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </div>
    );
}
