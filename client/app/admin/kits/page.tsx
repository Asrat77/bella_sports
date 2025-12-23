'use client';

import { useProductStore } from '@/store/useProductStore';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit2,
    Trash2,
    Eye,
    Image as ImageIcon
} from 'lucide-react';
import styles from './page.module.css';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import AddKitModal from '@/components/admin/AddKitModal';

export default function KitsInventory() {
    const { products, deleteProduct } = useProductStore();
    const [search, setSearch] = useState('');
    const [mounted, setMounted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={styles.inventory}>
            <header className={styles.header}>
                <div className={styles.titleInfo}>
                    <h1>Kits Inventory</h1>
                    <p>{products.length} products total</p>
                </div>
                <button
                    className={`btn btn-primary ${styles.addBtn}`}
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus size={18} /> New Kit
                </button>
            </header>

            <AddKitModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Search kits by name or league..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className={styles.filters}>
                    <button className={styles.toolBtn}><Filter size={14} /> Filter</button>
                    <button className={styles.toolBtn}>Sort: Newest</button>
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th><input type="checkbox" /></th>
                            <th>Kit Detail</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((product) => (
                            <tr key={product.id}>
                                <td><input type="checkbox" /></td>
                                <td>
                                    <div className={styles.productCell}>
                                        <div className={styles.thumb}>
                                            <Image src={product.image} alt="" fill style={{ objectFit: 'contain' }} />
                                        </div>
                                        <div className={styles.nameGroup}>
                                            <span className={styles.productName}>{product.name}</span>
                                            <span className={styles.productId}>ID: KIT-{product.id}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={styles.tag}>{product.category}</span>
                                </td>
                                <td className={styles.mono}>
                                    {product.price.toLocaleString()} ETB
                                </td>
                                <td>
                                    <div className={styles.stockInfo}>
                                        <div className={styles.stockBar}>
                                            <div className={styles.stockFill} style={{ width: '85%', background: '#4CAF50' }}></div>
                                        </div>
                                        <span>In Stock</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={styles.statusDot}></span>
                                    Active
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        <button className={styles.iconBtn} title="View"><Eye size={16} /></button>
                                        <button className={styles.iconBtn} title="Edit"><Edit2 size={16} /></button>
                                        <button
                                            className={`${styles.iconBtn} ${styles.danger}`}
                                            title="Delete"
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this kit?')) {
                                                    deleteProduct(product.id);
                                                }
                                            }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
