'use client';

import styles from './Influencers.module.css';

// Placeholder data - will be replaced with API data
const influencers = [
    {
        id: 1,
        name: 'Teddy Afro',
        handle: '@teddyafro',
        image: null,
        kit: 'Barcelona 24/25',
    },
    {
        id: 2,
        name: 'Rophnan',
        handle: '@rophnan',
        image: null,
        kit: 'Real Madrid 24/25',
    },
    {
        id: 3,
        name: 'Eelco',
        handle: '@eelcofc',
        image: null,
        kit: 'St. George FC',
    },
    {
        id: 4,
        name: 'Hana Girma',
        handle: '@hanagirma',
        image: null,
        kit: 'Chelsea 24/25',
    },
];

export default function Influencers() {
    return (
        <section className={styles.influencers}>
            <div className={`container ${styles.content}`}>
                {/* Section header */}
                <div className={styles.header}>
                    <span className={styles.sectionLabel}>Worn By</span>
                    <h2 className={styles.headline}>
                        Ethiopia's <span className="text-gradient">Finest</span>
                    </h2>
                    <p className={styles.subtext}>
                        From musicians to athletes, the Bellasport community keeps growing.
                    </p>
                </div>

                {/* Influencer grid - staggered for visual interest */}
                <div className={styles.grid}>
                    {influencers.map((influencer, index) => (
                        <div
                            key={influencer.id}
                            className={`${styles.card} ${index % 2 === 1 ? styles.cardOffset : ''}`}
                        >
                            <div className={styles.cardImage}>
                                <span className={styles.avatarPlaceholder}>
                                    {influencer.name.charAt(0)}
                                </span>
                            </div>
                            <div className={styles.cardContent}>
                                <h3 className={styles.name}>{influencer.name}</h3>
                                <span className={styles.handle}>{influencer.handle}</span>
                                <div className={styles.kitBadge}>
                                    <span>⚽ {influencer.kit}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className={styles.ctaBlock}>
                    <p className={styles.ctaText}>Want to be featured?</p>
                    <a
                        href="https://instagram.com/bellasport"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`btn btn-secondary ${styles.ctaButton}`}
                    >
                        Tag us @bellasport
                    </a>
                </div>
            </div>
        </section>
    );
}
