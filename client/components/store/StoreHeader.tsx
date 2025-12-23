import styles from './StoreHeader.module.css';

export default function StoreHeader() {
    return (
        <header className={styles.header}>
            <div className={styles.content}>
                <h1 className={styles.title}>
                    The <span className="text-accent">Collection</span>
                </h1>
                <p className={styles.subtitle}>
                    Premium kits from the Ethiopian Premier League and the world's biggest clubs.
                    Ready for customization.
                </p>
            </div>
        </header>
    );
}
