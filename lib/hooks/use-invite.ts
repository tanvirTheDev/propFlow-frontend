'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authApi } from '@/lib/api/auth.api';
import { useAuthStore } from '@/lib/stores/auth.store';
import { extractErrorMessage } from '@/lib/utils/error-handler';
import type { AcceptInviteInput } from '@/lib/api/types';

export function useInviteDetails(token: string) {
  return useQuery({
    queryKey: ['invite', token],
    queryFn: () => authApi.getInvite(token),
    retry: false,
  });
}

export function useAcceptInvite() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: AcceptInviteInput) => authApi.acceptInvite(data),
    onSuccess: (result) => {
      setAuth(result.user, { accessToken: result.accessToken, refreshToken: result.refreshToken });
      router.push('/tenant/dashboard');
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}
