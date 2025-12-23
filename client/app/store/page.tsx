import { Sidebar } from '@/components/layout';
import { StoreHeader, FilterSidebar, ProductGrid } from '@/components/store';
import styles from './page.module.css';

export default function StorePage() {
    return (
        <div className={styles.pageWrapper}>
            <Sidebar />
            <main className={styles.main}>
                <div className="container">
                    <StoreHeader />
                    <div className={styles.contentLayout}>
                        <FilterSidebar />
                        <ProductGrid />
                    </div>
                </div>
            </main>
        </div>
    );
}
