'use client';

import Link from 'next/link';
import styles from './FeaturedKits.module.css';

// Placeholder data - will be replaced with API data
const featuredKits = [
    {
        id: 1,
        name: 'Manchester United Home 24/25',
        club: 'Manchester United',
        league: 'Premier League',
        price: 2800,
        image: null,
        isNew: true,
    },
    {
        id: 2,
        name: 'Real Madrid Away 24/25',
        club: 'Real Madrid',
        league: 'La Liga',
        price: 3200,
        image: null,
        isNew: true,
    },
    {
        id: 3,
        name: 'St. George FC Home 2024',
        club: 'St. George FC',
        league: 'Ethiopian Premier',
        price: 1500,
        image: null,
        isNew: false,
    },
    {
        id: 4,
        name: 'Barcelona Third 24/25',
        club: 'Barcelona',
        league: 'La Liga',
        price: 3000,
        image: null,
        isNew: true,
    },
    {
        id: 5,
        name: 'PSG Home 24/25',
        club: 'Paris Saint-Germain',
        league: 'Ligue 1',
        price: 2900,
        image: null,
        isNew: false,
    },
    {
        id: 6,
        name: 'Ethiopia National Team',
        club: 'Ethiopia',
        league: 'National',
        price: 1800,
        image: null,
        isNew: false,
    },
];

export default function FeaturedKits() {
    return (
        <section className={styles.featured}>
            <div className={`container ${styles.content}`}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <span className={styles.sectionLabel}>New Arrivals</span>
                        <h2 className={styles.headline}>
                            Fresh From the <span className="text-gradient">Pitch</span>
                        </h2>
                    </div>
                    <Link href="/store" className={`btn btn-secondary ${styles.viewAllBtn}`}>
                        View All Kits
                    </Link>
                </div>

                {/* Kit grid - staggered */}
                <div className={styles.grid}>
                    {featuredKits.map((kit, index) => (
                        <Link
                            key={kit.id}
                            href={`/store/${kit.id}`}
                            className={`${styles.card} ${index % 3 === 1 ? styles.cardOffset : ''}`}
                        >
                            {kit.isNew && <span className={styles.newBadge}>New</span>}

                            <div className={styles.cardImage}>
                                <span className={styles.imagePlaceholder}>👕</span>
                            </div>

                            <div className={styles.cardContent}>
                                <span className={styles.league}>{kit.league}</span>
                                <h3 className={styles.kitName}>{kit.name}</h3>
                                <span className={styles.price}>
                                    <span className={styles.currency}>ETB</span> {kit.price.toLocaleString()}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
