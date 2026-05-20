import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invitesApi } from '@/lib/api/invites.api';
import type { CreateInviteInput } from '@/lib/api/types';

export const inviteKeys = {
  all: ['invites'] as const,
  list: () => [...inviteKeys.all, 'list'] as const,
};

export function useInvites() {
  return useQuery({
    queryKey: inviteKeys.list(),
    queryFn: () => invitesApi.list().then((r) => r.data),
  });
}

export function useCreateInvite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInviteInput) => invitesApi.create(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: inviteKeys.all }),
  });
}

export function useResendInvite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => invitesApi.resend(id).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: inviteKeys.all }),
  });
}

export function useCancelInvite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => invitesApi.cancel(id).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: inviteKeys.all }),
  });
}
