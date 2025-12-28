'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function OrderDetailPage() {
    const params = useParams();

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <Link href="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: '#666', textDecoration: 'none' }}>
                <ArrowLeft size={18} /> Back to Orders
            </Link>
            <div style={{ padding: '4rem 2rem', background: '#f8f9fa', borderRadius: '8px' }}>
                <h1 style={{ marginBottom: '1rem', color: '#333' }}>Order Details Coming Soon</h1>
                <p style={{ margin: '0.5rem 0', color: '#666' }}>Order #{params.id}</p>
                <p style={{ margin: '0.5rem 0', color: '#666' }}>Detailed order information will be available in a future update.</p>
            </div>
        </div>
    );
}