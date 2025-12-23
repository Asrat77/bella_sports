'use client';

import styles from './FilterSidebar.module.css';

const categories = [
    'All Kits',
    'Ethiopian Premier League',
    'Premier League',
    'La Liga',
    'National Teams',
    'Retro Kits'
];

export default function FilterSidebar() {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Collections</h3>
                <ul className={styles.list}>
                    {categories.map((cat, i) => (
                        <li key={i} className={styles.item}>
                            <button className={`${styles.button} ${i === 0 ? styles.active : ''}`}>
                                {cat}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Sort By</h3>
                <select className={styles.select}>
                    <option>Newest Arrivals</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Best Selling</option>
                </select>
            </div>
        </aside>
    );
}
