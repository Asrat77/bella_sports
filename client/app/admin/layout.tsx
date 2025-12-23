'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    Shirt,
    ShoppingBag,
    Settings,
    Search,
    ChevronDown,
    FileText,
    Boxes,
    BarChart3,
    Terminal,
    Menu,
    X
} from 'lucide-react';
import styles from './layout.module.css';
import { useState, useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Overview', href: '/admin' },
        { id: 'kits', icon: Shirt, label: 'Kits Inventory', href: '/admin/kits' },
        { id: 'orders', icon: ShoppingBag, label: 'Store Orders', href: '/admin/orders' },
    ];

    const currentTab = menuItems.find(item => pathname === item.href || pathname.startsWith(item.href + '/')) || menuItems[0];

    return (
        <div className={styles.adminLayout}>
            {/* Mobile Overlay */}
            <div
                className={`${styles.overlay} ${menuOpen ? styles.overlayShow : ''}`}
                onClick={() => setMenuOpen(false)}
            />

            {/* 1. Refined Sidebar */}
            <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.logoArea}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L22 12L12 22L2 12L12 2Z" fill="var(--accent-gold)" />
                    </svg>
                    <h2>ADMIN</h2>
                    <button className={styles.menuBtn} onClick={() => setMenuOpen(false)} style={{ marginLeft: 'auto' }}>
                        <X size={20} />
                    </button>
                </div>

                <nav className={styles.nav}>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || (item.id !== 'dashboard' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                                onClick={() => setMenuOpen(false)}
                            >
                                <Icon size={20} className={styles.navIcon} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ marginTop: 'auto' }}>
                    <div className={styles.navItem}>
                        <Settings size={20} className={styles.navIcon} />
                        <span>Settings</span>
                    </div>
                </div>
            </aside>

            {/* 2. Main Workspace */}
            <div className={styles.mainWrapper}>
                <div className={styles.topBar}>
                    <button className={styles.menuBtn} onClick={() => setMenuOpen(true)}>
                        <Menu size={20} />
                    </button>
                    <div className={styles.breadcrumb}>
                        <span>Admin</span>
                        <span>/</span>
                        <span>{currentTab.label}</span>
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>main*</div>
                        <Search size={16} color="var(--text-muted)" />
                    </div>
                </div>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </div>
    );
}
