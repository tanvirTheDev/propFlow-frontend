'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/lib/api/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, tokens: { accessToken: string; refreshToken: string }) => void;
  updateUser: (user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: (user, tokens) => {
        if (typeof document !== 'undefined') {
          document.cookie = `propflow-token=${tokens.accessToken}; path=/; max-age=3600; SameSite=Lax`;
        }
        set({ user, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, isAuthenticated: true });
      },
      updateUser: (user) => set({ user }),
      clearAuth: () => {
        if (typeof document !== 'undefined') {
          document.cookie = 'propflow-token=; path=/; max-age=0';
        }
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },
    }),
    { name: 'propflow-auth' },
  ),
);
