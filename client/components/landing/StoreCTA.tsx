'use client';

import Link from 'next/link';
import styles from './StoreCTA.module.css';

export default function StoreCTA() {
    return (
        <section className={styles.cta}>
            <div className={`container ${styles.content}`}>
                <div className={styles.bgGlow} />

                <div className={styles.textBlock}>
                    <h2 className={styles.headline}>
                        Ready to Find <span className="text-gradient">Your Kit?</span>
                    </h2>
                    <p className={styles.subtext}>
                        100+ authentic jerseys. Customize with your name.
                        Delivered anywhere in Ethiopia.
                    </p>
                </div>

                <Link href="/store" className={`btn btn-primary ${styles.ctaButton}`}>
                    Enter the Store
                    <span className={styles.arrow}>→</span>
                </Link>
            </div>
        </section>
    );
}
