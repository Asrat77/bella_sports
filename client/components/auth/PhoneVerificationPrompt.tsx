'use client';

import { useState, useEffect } from 'react';
import { useAuthStore, getAuthHeaders } from '@/store/useAuthStore';
import { Smartphone, ExternalLink, Clock } from 'lucide-react';
import styles from './PhoneVerificationPrompt.module.css';

interface PhoneVerificationPromptProps {
    onDismiss?: () => void;
}

export default function PhoneVerificationPrompt({ onDismiss }: PhoneVerificationPromptProps) {
    const { user, updateUser } = useAuthStore();
    const [isChecking, setIsChecking] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    // Check if user is verified
    useEffect(() => {
        if (user?.phoneVerified) {
            setIsVerified(true);
        }
    }, [user]);

    // Poll for phone verification status
    useEffect(() => {
        if (!user || user.phoneVerified) return;

        const interval = setInterval(async () => {
            try {
                const { fetchWithAuth } = await import('@/lib/api');
                const response = await fetchWithAuth('/api/v1/auth/me');

                if (response.ok) {
                    const data = await response.json();
                    if (data.data.phoneVerified) {
                        updateUser({ phoneVerified: true, phone_number: data.data.phone_number });
                        setIsVerified(true);
                        onDismiss?.();
                    }
                }
            } catch (error) {
                console.error('Error checking phone verification status:', error);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [user, updateUser, onDismiss]);

    const handleOpenTelegram = () => {
        window.open('https://t.me/BellaSportsBot', '_blank');
    };

    if (!user || isVerified) {
        return null;
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div className={styles.iconWrapper}>
                        <Smartphone size={32} />
                    </div>
                    <h2 className={styles.title}>
                        Phone Verification Required
                    </h2>
                    <p className={styles.description}>
                        To complete your Bella Sports account setup, please verify your phone number
                    </p>
                </div>

                <div className={styles.infoBox}>
                    <Clock size={20} className={styles.infoIcon} />
                    <div>
                        <p className={styles.infoTitle}>Why we need your phone:</p>
                        <ul className={styles.infoList}>
                            <li>• Order confirmations</li>
                            <li>• Delivery updates</li>
                            <li>• Customer support</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.buttonGroup}>
                    <button
                        onClick={handleOpenTelegram}
                        className={styles.primaryButton}
                    >
                        <ExternalLink size={20} />
                        Open Telegram to Verify Phone
                    </button>

                    <button
                        onClick={() => setIsChecking(true)}
                        className={styles.secondaryButton}
                    >
                        {isChecking ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <div className={styles.loader}></div>
                                Checking status...
                            </div>
                        ) : (
                            "I Already Verified My Phone"
                        )}
                    </button>
                </div>

                <div className={styles.stepsBox}>
                    <p className={styles.stepsText}>
                        <strong>Steps:</strong> Click the button above → Chat with BellaSportsBot →
                        Tap "Share Phone Number" → Return here automatically
                    </p>
                </div>

                <button
                    onClick={onDismiss}
                    className={styles.dismissButton}
                >
                    I'll do this later
                </button>
            </div>
        </div>
    );
}