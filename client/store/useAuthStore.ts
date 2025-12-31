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
    phoneVerified?: boolean;
    requiresPhoneVerification?: boolean;
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
    isValidating: boolean;
    hasHydrated: boolean;
    login: (authData: UserSession) => void;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
    validateSession: () => Promise<boolean>;
    setHasHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            user: null,
            token: null,
            isValidating: false,
            hasHydrated: false,
            login: (authData) => set({
                isAuthenticated: true,
                user: authData.user,
                token: authData.token,
            }),
            logout: () => set({
                isAuthenticated: false,
                user: null,
                token: null,
                isValidating: false,
            }),
            updateUser: (updates) => set((state) => ({
                user: state.user ? { ...state.user, ...updates } : null,
            })),
            setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
            validateSession: async () => {
                const { token, isAuthenticated } = get();
                if (!token || !isAuthenticated) return false;

                set({ isValidating: true });
                try {
                    // We import dynamically to avoid circular dependency since api.ts imports useAuthStore
                    const { fetchWithAuth } = await import('@/lib/api');
                    const response = await fetchWithAuth('/api/v1/auth/me');

                    if (response.ok) {
                        const { data } = await response.json();
                        set({ user: data, isAuthenticated: true, isValidating: false });
                        return true;
                    } else {
                        // handle unauthorized or other errors
                        get().logout();
                        return false;
                    }
                } catch (error) {
                    console.error('Session validation failed:', error);
                    set({ isValidating: false });
                    return false;
                }
            },
        }),
        {
            name: 'bellasport-auth',
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                token: state.token,
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);

export const getAuthHeaders = () => {
    const { token } = useAuthStore.getState();
    return token ? { Authorization: `Bearer ${token}` } : undefined;
};
