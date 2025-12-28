import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
    id: string;
    telegram_id: string;
    first_name: string;
    last_name?: string;
    username?: string;
    email?: string;
    phone_number?: string;
    photo_url?: string;
    full_name: string;
    store_credit_balance: number;
    store_credit_in_etb: number;
    telegram_notification_available?: boolean;
}

export interface UserSession {
    id: string;
    token: string;
    expires_at: string;
    last_used_at?: string;
    expired: boolean;
    active: boolean;
    user: User;
}

interface AuthStore {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    login: (authData: UserSession) => void;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            user: null,
            token: null,
            login: (authData) => set({
                isAuthenticated: true,
                user: authData.user,
                token: authData.token,
            }),
            logout: () => set({
                isAuthenticated: false,
                user: null,
                token: null,
            }),
            updateUser: (updates) => set((state) => ({
                user: state.user ? { ...state.user, ...updates } : null,
            })),
        }),
        {
            name: 'bellasport-auth',
        }
    )
);

export const getAuthHeaders = () => {
    const { token } = useAuthStore.getState();
    return token ? { Authorization: `Bearer ${token}` } : {};
};
