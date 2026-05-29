'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { authApi } from '@/lib/api/auth.api';
import { useAuthStore } from '@/lib/stores/auth.store';
import { extractErrorMessage } from '@/lib/utils/error-handler';
import { ROLE_DASHBOARD } from '@/lib/constants/roles';
import type { LoginInput, RegisterInput } from '@/lib/api/types';

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: (result) => {
      setAuth(result.user, { accessToken: result.accessToken, refreshToken: result.refreshToken });
      router.push(ROLE_DASHBOARD[result.user.role]);
    },
    onError: (error) => {
      const axiosError = error as AxiosError;
      // Network error after retry = server still unreachable
      if (!axiosError.response) {
        toast.error('Server is unavailable. Please try again in a moment.');
      } else {
        toast.error(extractErrorMessage(error));
      }
    },
  });
}

export function useRegister() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterInput) => authApi.register(data),
    onSuccess: (result) => {
      setAuth(result.user, { accessToken: result.accessToken, refreshToken: result.refreshToken });
      router.push(ROLE_DASHBOARD[result.user.role]);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}

export function useLogout() {
  const { clearAuth } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      router.push('/login');
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: { email: string; code: string; newPassword: string }) =>
      authApi.resetPassword(data),
  });
}

export function useMe() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.me(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}
