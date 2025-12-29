'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

declare global {
    interface Window {
        Telegram: {
            Login: {
                auth: (
                    callback: (data: TelegramAuthData) => void,
                    options?: TelegramLoginOptions
                ) => void;
            };
        };
    }
}

export interface TelegramAuthData {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
}

export interface TelegramLoginOptions {
    bot_id: string;
    request_access?: boolean;
    lang?: string;
}

interface TelegramLoginButtonProps {
    botUsername?: string;
    className?: string;
    onLoginSuccess?: (data: any) => void;
    onLoginError?: (error: string) => void;
    children?: React.ReactNode;
}

const TELEGRAM_BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'your_bot_username';

export default function TelegramLoginButton({
    botUsername = TELEGRAM_BOT_USERNAME,
    className = '',
    onLoginSuccess,
    onLoginError,
    children,
}: TelegramLoginButtonProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { login } = useAuthStore();

    useEffect(() => {
        const container = containerRef.current;
        if (!container || !botUsername) return;

        // Skip if script is already there
        if (container.querySelector('script')) return;

        // Define global callback matching user's snippet structure
        (window as any).onTelegramAuth = (user: TelegramAuthData) => {
            // Optional: Alert as requested by user for verification
            // alert('Logged in as ' + user.first_name + ' ' + user.last_name + ' (' + user.id + (user.username ? ', @' + user.username : '') + ')');

            handleTelegramAuth(user);
        };

        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.setAttribute('data-telegram-login', botUsername);
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-onauth', 'onTelegramAuth(user)');
        script.setAttribute('data-request-access', 'write');
        script.async = true;

        container.appendChild(script);

        return () => {
            // Cleanup global callback and script element only
            delete (window as any).onTelegramAuth;
            if (container) {
                const script = container.querySelector('script[src*="telegram-widget.js"]');
                if (script) {
                    script.remove();
                }
            }
        };
    }, [botUsername, onLoginError]);

    const handleTelegramAuth = async (authData: TelegramAuthData) => {
        try {
            const response = await fetch('/api/v1/auth/telegram_callback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify(authData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Authentication failed');
            }

            const sessionData = await response.json();
            login(sessionData);
            onLoginSuccess?.(sessionData);
        } catch (error) {
            onLoginError?.(error instanceof Error ? error.message : 'Authentication failed');
        }
    };

    return (
        <div className={`telegram-login-button ${className}`}>
            <div ref={containerRef} className="flex justify-center" />
            {children && <div className="custom-login-button">{children}</div>}
        </div>
    );
}
