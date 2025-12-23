'use client';

import Link from 'next/link';
import styles from './Footer.module.css';

const branches = [
    {
        name: 'Bole Branch',
        address: 'Atlas Building, 3rd Floor, Bole Road',
        city: 'Addis Ababa',
        phone: '+251 91 234 5678',
    },
    {
        name: 'Piassa Branch',
        address: 'Churchill Avenue, Next to Commercial Bank',
        city: 'Addis Ababa',
        phone: '+251 91 345 6789',
    },
    {
        name: 'Megenagna Branch',
        address: 'Megenagna Square, Sunshine Building',
        city: 'Addis Ababa',
        phone: '+251 91 456 7890',
    },
];

const socialLinks = [
    { name: 'Instagram', url: 'https://instagram.com/bellasport', icon: '📸' },
    { name: 'TikTok', url: 'https://tiktok.com/@bellasport', icon: '🎵' },
    { name: 'Telegram', url: 'https://t.me/bellasport', icon: '✈️' },
    { name: 'WhatsApp', url: 'https://wa.me/251912345678', icon: '💬' },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.content}`}>
                {/* Top section */}
                <div className={styles.topSection}>
                    {/* Brand */}
                    <div className={styles.brandBlock}>
                        <Link href="/" className={styles.logo}>
                            <span className={styles.logoIcon}>⚽</span>
                            <span className={styles.logoText}>Bellasport</span>
                        </Link>
                        <p className={styles.tagline}>
                            Ethiopia's premier destination for authentic football kits.
                        </p>
                        <div className={styles.socialLinks}>
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.socialLink}
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Branches */}
                    <div className={styles.branchesGrid}>
                        {branches.map((branch) => (
                            <div key={branch.name} className={styles.branch}>
                                <h4 className={styles.branchName}>{branch.name}</h4>
                                <address className={styles.branchAddress}>
                                    <p>{branch.address}</p>
                                    <p>{branch.city}</p>
                                    <a href={`tel:${branch.phone}`} className={styles.branchPhone}>
                                        {branch.phone}
                                    </a>
                                </address>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom section */}
                <div className={styles.bottomSection}>
                    <p className={styles.copyright}>
                        © {currentYear} Bellasport. All rights reserved.
                    </p>
                    <nav className={styles.legalLinks}>
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms">Terms of Service</Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
