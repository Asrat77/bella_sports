'use client';

import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            {/* Background */}
            <div className={styles.bgLayer} />

            {/* Content */}
            <div className={`container ${styles.content}`}>
                <div className={styles.textBlock}>
                    {/* Eyebrow badge */}
                    <span className={styles.eyebrow}>
                        THE PRIDE OF ADDIS
                    </span>

                    {/* Main headline with italic gold accent */}
                    <h1 className={styles.headline}>
                        Wear the{' '}
                        <em className={styles.headlineAccent}>Pulse</em> of{' '}
                        <br />
                        Highlands.
                    </h1>

                    {/* Subheadline */}
                    <p className={styles.subheadline}>
                        Authentic Ethiopian football kits. Crafted for the stadium,
                        designed for the streets. Experience the roar of the game in every thread.
                    </p>

                    {/* CTAs */}
                    <div className={styles.ctas}>
                        <Link href="/store" className={`btn btn-primary ${styles.ctaPrimary}`}>
                            Shop Collection
                            <span className={styles.arrow}>→</span>
                        </Link>
                        <Link href="/customize" className={`btn btn-secondary ${styles.ctaSecondary}`}>
                            Customize Jersey
                        </Link>
                    </div>

                    {/* Stats row */}
                    <div className={styles.statsRow}>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>100+</span>
                            <span className={styles.statLabel}>Authentic Kits</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>24h</span>
                            <span className={styles.statLabel}>Local Delivery</span>
                        </div>
                        <div className={styles.statRating}>
                            <span className={styles.stars}>★★★★★</span>
                            <span className={styles.statLabel}>Trusted by Fans</span>
                        </div>
                    </div>
                </div>

                {/* Hero Image - Featured Jersey */}
                <div className={styles.imageBlock}>
                    <div className={styles.jerseyCard}>
                        <div className={styles.jerseyBadge}>
                            <span className={styles.badgeLabel}>NEW ARRIVAL</span>
                            <span className={styles.badgeTitle}>Home Kit 24/25</span>
                            <span className={styles.badgeSubtitle}>Limited Edition</span>
                        </div>
                        <div className={styles.jerseyImage}>
                            <span className={styles.jerseyPlaceholder}>👕</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
