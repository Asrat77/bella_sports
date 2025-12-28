'use client';

import { useEffect } from 'react';
import TelegramLoginButton from '@/components/auth/TelegramLoginButton';
import { useAuthStore } from '@/store/useAuthStore';
import { LogOut, ShoppingBag, Heart, Settings, Package } from 'lucide-react';
import Link from 'next/link';

export default function AccountPage() {
    const { isAuthenticated, user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
    };

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Sign in to your account
                        </h1>
                        <p className="text-gray-400">
                            Access your orders, challenges, and personalized offers
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-6">
                        <div className="w-full">
                            <div className="text-center mb-4">
                                <p className="text-gray-400 text-sm mb-4">
                                    Use your Telegram account for quick and secure access
                                </p>
                            </div>
                            <div id="telegram-login-container" className="flex justify-center">
                                <TelegramLoginButton
                                    onLoginSuccess={(data) => {
                                        console.log('Login successful:', data);
                                    }}
                                    onLoginError={(error) => {
                                        console.error('Login failed:', error);
                                    }}
                                />
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-xs text-gray-500">
                                By signing in, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50 mb-6">
                    <div className="flex items-center gap-6">
                        {user.photo_url ? (
                            <img
                                src={user.photo_url}
                                alt={user.full_name}
                                className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-amber-500/20"
                            />
                        ) : (
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                                <span className="text-3xl md:text-4xl font-bold text-white">
                                    {user.first_name[0].toUpperCase()}
                                </span>
                            </div>
                        )}
                        <div className="flex-1">
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                                {user.full_name}
                            </h1>
                            {user.username && (
                                <p className="text-gray-400">@{user.username}</p>
                            )}
                            {user.email && (
                                <p className="text-gray-400 text-sm">{user.email}</p>
                            )}
                            {user.phone_number && (
                                <p className="text-gray-400 text-sm">{user.phone_number}</p>
                            )}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                            title="Sign out"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>

                {/* Store Credit */}
                <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/30 mb-6">
                    <h2 className="text-lg font-semibold text-white mb-2">Store Credit</h2>
                    <p className="text-3xl md:text-4xl font-bold text-amber-500">
                        ETB {user.store_credit_in_etb.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                        Available for future purchases
                    </p>
                </div>

                {/* Account Actions */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                    <h2 className="text-lg font-semibold text-white mb-4">Account Actions</h2>
                    <div className="space-y-3">
                        <Link
                            href="/orders"
                            className="flex items-center gap-4 p-4 rounded-xl bg-gray-700/30 hover:bg-gray-700/50 transition-colors"
                        >
                            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
                                <Package size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-medium">My Orders</p>
                                <p className="text-sm text-gray-400">View order history and status</p>
                            </div>
                        </Link>

                        <Link
                            href="/store"
                            className="flex items-center gap-4 p-4 rounded-xl bg-gray-700/30 hover:bg-gray-700/50 transition-colors"
                        >
                            <div className="p-3 rounded-lg bg-amber-500/10 text-amber-500">
                                <ShoppingBag size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-medium">Continue Shopping</p>
                                <p className="text-sm text-gray-400">Browse our collection</p>
                            </div>
                        </Link>

                        {user.telegram_notification_available && (
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-700/30">
                                <div className="p-3 rounded-lg bg-green-500/10 text-green-500">
                                    <Heart size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-white font-medium">Telegram Notifications</p>
                                    <p className="text-sm text-gray-400">Enabled for order updates</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
