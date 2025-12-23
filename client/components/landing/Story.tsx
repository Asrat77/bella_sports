'use client';

import styles from './Story.module.css';

export default function Story() {
    return (
        <section id="story" className={styles.story}>
            <div className={`container ${styles.content}`}>
                {/* Left: Visual element */}
                <div className={styles.visualBlock}>
                    <div className={styles.imageFrame}>
                        <div className={styles.imagePlaceholder}>
                            <span>🏟️</span>
                            <p>Addis Ababa Stadium</p>
                        </div>
                    </div>
                    {/* Decorative accent */}
                    <div className={styles.accentBar} />
                </div>

                {/* Right: Text content */}
                <div className={styles.textBlock}>
                    <span className={styles.sectionLabel}>Our Story</span>

                    <h2 className={styles.headline}>
                        From the Highlands to the <span className="text-gradient">Pitch</span>
                    </h2>

                    <div className={styles.storyText}>
                        <p>
                            Bellasport was born from a simple dream: to bring the world's greatest football
                            kits to Ethiopian fans who share our passion for the beautiful game.
                        </p>
                        <p>
                            Based in the heart of Addis Ababa, we source authentic jerseys from top clubs
                            across Europe, South America, and the Ethiopian Premier League. Every kit tells
                            a story—of legendary players, historic victories, and fans united by love for their team.
                        </p>
                        <p>
                            Whether you're cheering for St. George, dreaming of Camp Nou, or wearing your
                            colors to a local match, Bellasport is your gateway to authentic football culture.
                        </p>
                    </div>

                    {/* Stats inline */}
                    <div className={styles.inlineStats}>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>3</span>
                            <span className={styles.statLabel}>Locations</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>100+</span>
                            <span className={styles.statLabel}>Kits</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>500+</span>
                            <span className={styles.statLabel}>Happy Fans</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
