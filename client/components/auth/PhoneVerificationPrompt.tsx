'use client';

import { useState, useEffect } from 'react';
import { useAuthStore, getAuthHeaders } from '@/store/useAuthStore';
import { Smartphone, ExternalLink, CheckCircle, Clock } from 'lucide-react';

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
                const response = await fetch('/api/v1/auth/me', {
                    headers: getAuthHeaders()
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.data.user.phoneVerified) {
                        updateUser({ phoneVerified: true, phone_number: data.data.user.phone_number });
                        setIsVerified(true);
                        onDismiss?.();
                    }
                }
            } catch (error) {
                console.error('Error checking phone verification status:', error);
            }
        }, 5000); // Check every 5 seconds

        return () => clearInterval(interval);
    }, [user, updateUser, onDismiss]);

    const handleOpenTelegram = () => {
        window.open('https://t.me/BellaSportsBot', '_blank');
    };

    if (!user || isVerified) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-auto shadow-2xl">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Smartphone className="w-8 h-8 text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Phone Verification Required
                    </h2>
                    <p className="text-gray-600 text-sm">
                        To complete your Bella Sports account setup, please verify your phone number
                    </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Why we need your phone:</p>
                            <ul className="space-y-1 text-blue-700">
                                <li>• Order confirmations</li>
                                <li>• Delivery updates</li>
                                <li>• Customer support</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={handleOpenTelegram}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                    >
                        <ExternalLink className="w-5 h-5" />
                        Open Telegram to Verify Phone
                    </button>

                    <button
                        onClick={() => setIsChecking(true)}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                    >
                        I Already Verified My Phone
                    </button>
                </div>

                {isChecking && (
                    <div className="mt-4 text-center">
                        <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            Checking verification status...
                        </div>
                    </div>
                )}

                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                        <strong>Steps:</strong> Click the button above → Chat with BellaSportsBot →
                        Tap "Share Phone Number" → Return here automatically
                    </p>
                </div>

                <div className="mt-4 text-center">
                    <button
                        onClick={onDismiss}
                        className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                        I'll do this later
                    </button>
                </div>
            </div>
        </div>
    );
}