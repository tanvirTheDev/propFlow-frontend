'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { visitsApi } from '@/lib/api/visits.api';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import type { CreateVisitPayload } from '@/lib/api/types';

interface VisitFilters {
  from?: string;
  to?: string;
  status?: string;
  propertyId?: string;
}

export function useVisits(params?: VisitFilters) {
  return useQuery({
    queryKey: ['visits', params ?? {}],
    queryFn: () => visitsApi.list(params),
    staleTime: 2 * 60 * 1000,
  });
}

export function useVisit(id: string) {
  return useQuery({
    queryKey: ['visits', id],
    queryFn: () => visitsApi.get(id),
    enabled: Boolean(id),
  });
}

export function useCreateVisit() {
  const queryClient = useQueryClient();
  const t = useTranslations('visits');

  return useMutation({
    mutationFn: (data: CreateVisitPayload) => visitsApi.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(t('created'));
      if (data.warning === '24h_notice') {
        toast.warning(t('warning24h'), { duration: 8000 });
      }
    },
    onError: () => toast.error(t('createError')),
  });
}

export function useUpdateVisit(id: string) {
  const queryClient = useQueryClient();
  const t = useTranslations('visits');

  return useMutation({
    mutationFn: (data: Partial<CreateVisitPayload>) => visitsApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      toast.success(t('updated'));
      if (data.warning === '24h_notice') {
        toast.warning(t('warning24h'), { duration: 8000 });
      }
    },
    onError: () => toast.error(t('updateError')),
  });
}

export function useCancelVisit(id: string) {
  const queryClient = useQueryClient();
  const t = useTranslations('visits');

  return useMutation({
    mutationFn: (reason?: string) => visitsApi.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      toast.success(t('cancelled'));
    },
    onError: () => toast.error(t('createError')),
  });
}

export function useCompleteVisit(id: string) {
  const queryClient = useQueryClient();
  const t = useTranslations('visits');

  return useMutation({
    mutationFn: (note?: string) => visitsApi.complete(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      toast.success(t('completed'));
    },
    onError: () => toast.error(t('createError')),
  });
}
