'use client';

import { useEffect, useState } from 'react';
import TelegramLoginButton from '@/components/auth/TelegramLoginButton';
import PhoneVerificationPrompt from '@/components/auth/PhoneVerificationPrompt';
import { useAuthStore } from '@/store/useAuthStore';
import { LogOut, ShoppingBag, Heart, Package } from 'lucide-react';
import Link from 'next/link';
import styles from './Account.module.css';

export default function AccountPage() {
    const { isAuthenticated, user, logout } = useAuthStore();
    const [showPhonePrompt, setShowPhonePrompt] = useState(false);

    // Show phone verification prompt immediately after login if needed
    useEffect(() => {
        if (isAuthenticated && user && user.requiresPhoneVerification && !showPhonePrompt) {
            setShowPhonePrompt(true);
        }
    }, [isAuthenticated, user, showPhonePrompt]);

    if (!isAuthenticated || !user) {
        return (
            <div className={styles.accountContainer}>
                <div className={styles.maxContainer} style={{ textAlign: 'center', paddingTop: '10vh' }}>
                    <h1 className={styles.title} style={{ marginBottom: 'var(--space-md)' }}>Sign in to continue</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-2xl)' }}>
                        Access your orders, challenges, and personalized offers
                    </p>
                    <div className={styles.profileCard} style={{ display: 'inline-flex', justifyContent: 'center' }}>
                        <TelegramLoginButton />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.accountContainer}>
            {/* Phone verification prompt overlay */}
            {showPhonePrompt && (
                <PhoneVerificationPrompt onDismiss={() => setShowPhonePrompt(false)} />
            )}
            
            <div className={styles.maxContainer}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Account Dashboard</h1>
                    <button onClick={logout} className={styles.logoutBtn}>
                        <LogOut size={18} />
                        Logout
                    </button>
                </header>

                <section className={styles.profileCard}>
                    {user.photo_url ? (
                        <img src={user.photo_url} alt={user.full_name} className={styles.avatar} />
                    ) : (
                        <div className={styles.avatarPlaceholder}>
                            {user.first_name[0].toUpperCase()}
                        </div>
                    )}
                    <div className={styles.userInfo}>
                        <h2>{user.full_name}</h2>
                        {user.username && <p>@{user.username}</p>}
                        
                        {/* Phone verification status */}
                        <div style={{ marginTop: 'var(--space-sm)' }}>
                            {user.phoneVerified ? (
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '6px',
                                    color: 'var(--primary-green-light)',
                                    fontSize: '0.875rem'
                                }}>
                                    ✓ Phone Verified
                                </div>
                            ) : (
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '6px',
                                    color: 'var(--primary-amber-light)',
                                    fontSize: '0.875rem'
                                }}>
                                    ⚠ Phone Verification Required
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section className={styles.creditCard}>
                    <div className={styles.creditLabel}>Store Credit Balance</div>
                    <div className={styles.creditValue}>
                        ETB {user.store_credit_in_etb.toFixed(2)}
                    </div>
                </section>

                <section className={styles.actionsGrid}>
                    <Link href="/orders" className={styles.actionItem}>
                        <div className={styles.iconWrapper}>
                            <Package size={24} />
                        </div>
                        <div className={styles.actionText}>
                            <h3>My Orders</h3>
                            <p>Track current and past purchases</p>
                        </div>
                    </Link>

                    <Link href="/store" className={styles.actionItem}>
                        <div className={styles.iconWrapper}>
                            <ShoppingBag size={24} />
                        </div>
                        <div className={styles.actionText}>
                            <h3>Shop Now</h3>
                            <p>Browse our latest collection</p>
                        </div>
                    </Link>

                    {user.telegram_notification_available && (
                        <div className={styles.actionItem}>
                            <div className={styles.iconWrapper} style={{ color: 'var(--primary-green-light)' }}>
                                <Heart size={24} />
                            </div>
                            <div className={styles.actionText}>
                                <h3>Notifications</h3>
                                <p>Telegram updates are active</p>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

