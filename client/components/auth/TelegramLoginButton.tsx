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
    const scriptRef = useRef<HTMLScriptElement | null>(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const { login } = useAuthStore();

    useEffect(() => {
        if (isScriptLoaded) return;

        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.setAttribute('data-telegram-login', botUsername);
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-radius', '8');
        script.setAttribute('data-userpic', 'true');
        script.setAttribute('data-request-access', 'write');
        script.async = true;

        const handleAuthMessage = (event: MessageEvent) => {
            if (event.origin !== 'https://telegram.org') return;
            
            try {
                const authData = event.data;
                
                if (authData && typeof authData === 'object' && 'id' in authData) {
                    handleTelegramAuth(authData as TelegramAuthData);
                }
            } catch (error) {
                console.error('Error parsing Telegram auth data:', error);
                onLoginError?.('Failed to process authentication');
            }
        };

        window.addEventListener('message', handleAuthMessage);
        scriptRef.current = script;
        setIsScriptLoaded(true);

        return () => {
            window.removeEventListener('message', handleAuthMessage);
            if (scriptRef.current && scriptRef.current.parentNode) {
                scriptRef.current.parentNode.removeChild(scriptRef.current);
            }
        };
    }, [botUsername, onLoginError]);

    const handleTelegramAuth = async (authData: TelegramAuthData) => {
        try {
            const response = await fetch('/api/v1/auth/telegram_callback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
            console.error('Telegram authentication error:', error);
            onLoginError?.(error instanceof Error ? error.message : 'Authentication failed');
        }
    };

    return (
        <div className={`telegram-login-button ${className}`}>
            <div
                id="telegram-login-widget"
                data-telegram-login={botUsername}
                data-size="large"
                data-radius="8"
                data-request-access="write"
                data-userpic="true"
            />
            {children && <div className="custom-login-button">{children}</div>}
        </div>
    );
}
