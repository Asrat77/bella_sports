'use client';

import { useState } from 'react';
import { X, Upload, Plus } from 'lucide-react';
import styles from './AddKitModal.module.css';
import { useProductStore } from '@/store/useProductStore';
import { Product } from '@/lib/mockData';

interface AddKitModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddKitModal({ isOpen, onClose }: AddKitModalProps) {
    const addProduct = useProductStore(state => state.addProduct);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'Ethiopian Premier League',
        league: 'Ethiopian Premier',
        image: '/images/kits/ethiopia-home.jpg', // Default placeholder
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newKit: Product = {
            id: Math.floor(Math.random() * 10000).toString(),
            name: formData.name,
            price: Number(formData.price),
            category: formData.category,
            league: formData.league,
            image: formData.image,
            isNew: true,
        };

        addProduct(newKit);
        onClose();
        setFormData({
            name: '',
            price: '',
            category: 'Ethiopian Premier League',
            league: 'Ethiopian Premier',
            image: '/images/kits/ethiopia-home.jpg',
        });
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <header className={styles.header}>
                    <h2>Add New <span className="text-accent">Kit</span></h2>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <X size={20} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.uploadArea}>
                        <div className={styles.preview}>
                            <Upload size={24} className={styles.uploadIcon} />
                            <span>Upload Pattern/Jersey Image</span>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Kit Name</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Manchester United Home 24/25"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.inputGroup}>
                            <label>Base Price (ETB)</label>
                            <input
                                type="number"
                                required
                                placeholder="3500"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Category</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option>Ethiopian Premier League</option>
                                <option>Premier League</option>
                                <option>La Liga</option>
                                <option>National Teams</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>League Name</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Premier League"
                            value={formData.league}
                            onChange={e => setFormData({ ...formData, league: e.target.value })}
                        />
                    </div>

                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
                        <button type="submit" className="btn btn-primary">
                            <Plus size={18} /> Create Kit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
