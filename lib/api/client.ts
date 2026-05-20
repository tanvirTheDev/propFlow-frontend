'use client';

import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/stores/auth.store';
import type { ApiWrapper, TokenResponse } from './types';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((promise) => {
    if (error) promise.reject(error);
    else promise.resolve(token);
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => {
    const wrapped = response.data as ApiWrapper<unknown>;
    return { ...response, data: wrapped.data ?? response.data };
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest?._retry) {
      const { refreshToken, clearAuth } = useAuthStore.getState();

      if (!refreshToken) {
        clearAuth();
        if (typeof window !== 'undefined') window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest) {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest!);
        });
      }

      isRefreshing = true;
      if (originalRequest) originalRequest._retry = true;

      try {
        const response = await axios.post<ApiWrapper<TokenResponse>>(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refreshToken },
        );
        const tokens = response.data.data ?? (response.data as unknown as TokenResponse);
        const { user } = useAuthStore.getState();
        if (user) useAuthStore.getState().setAuth(user, tokens);

        processQueue(null, tokens.accessToken);
        if (originalRequest) {
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
        return apiClient(originalRequest!);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuth();
        if (typeof window !== 'undefined') window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (!error.response && typeof window !== 'undefined') {
      toast.error('Keine Verbindung zum Server. Bitte überprüfe deine Internetverbindung.');
    }

    return Promise.reject(error);
  },
);
