'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

import { Home, ShoppingBag, Palette, User, ShoppingCart, Package } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/store', icon: ShoppingBag, label: 'Store' },
    { href: '/customize', icon: Palette, label: 'Customize' },
    { href: '/orders', icon: Package, label: 'Orders' },
    { href: '/account', icon: User, label: 'Account' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { toggleCart, getTotalItems } = useCartStore();
    const totalItems = getTotalItems();

    return (
        <aside className={styles.sidebar}>
            {/* Logo */}
            <Link href="/" className={styles.logo}>
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={styles.logoIcon}
                >
                    <path
                        d="M12 2L22 12L12 22L2 12L12 2Z"
                        fill="var(--accent-gold)"
                    />
                </svg>
            </Link>

            {/* Divider */}
            <div className={styles.divider} />

            {/* Navigation */}
            <nav className={styles.nav}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                            aria-label={item.label}
                            title={item.label}
                        >
                            <Icon size={20} className={styles.navIcon} />
                        </Link>
                    );
                })}

                {/* Cart Toggle */}
                <button
                    className={styles.cartBtn}
                    onClick={() => toggleCart(true)}
                    aria-label="Open Cart"
                >
                    <ShoppingCart size={20} />
                    {totalItems > 0 && (
                        <span className={styles.cartBadge}>{totalItems}</span>
                    )}
                </button>
            </nav>

            {/* Bottom spacer */}
            <div className={styles.spacer} />
        </aside>
    );
}
