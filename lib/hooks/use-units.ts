import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { unitsApi } from '@/lib/api/units.api';
import type { CreateUnitInput } from '@/lib/api/types';

export const unitKeys = {
  all: ['units'] as const,
  byProperty: (propertyId: string) => [...unitKeys.all, 'property', propertyId] as const,
  detail: (id: string) => [...unitKeys.all, 'detail', id] as const,
  myUnit: () => [...unitKeys.all, 'my-unit'] as const,
};

export function useUnitsByProperty(propertyId: string) {
  return useQuery({
    queryKey: unitKeys.byProperty(propertyId),
    queryFn: () => unitsApi.listByProperty(propertyId).then((r) => r.data),
    enabled: Boolean(propertyId),
  });
}

export function useUnit(id: string) {
  return useQuery({
    queryKey: unitKeys.detail(id),
    queryFn: () => unitsApi.get(id).then((r) => r.data),
    enabled: Boolean(id),
  });
}

export function useMyUnit() {
  return useQuery({
    queryKey: unitKeys.myUnit(),
    queryFn: () => unitsApi.getMyUnit().then((r) => r.data),
  });
}

export function useCreateUnit(propertyId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUnitInput) =>
      unitsApi.create(propertyId, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: unitKeys.byProperty(propertyId) }),
  });
}

export function useUpdateUnit(id: string, propertyId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CreateUnitInput>) =>
      unitsApi.update(id, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: unitKeys.detail(id) });
      qc.invalidateQueries({ queryKey: unitKeys.byProperty(propertyId) });
    },
  });
}

export function useDeleteUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unitsApi.delete(id).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: unitKeys.all }),
  });
}

export function useRemoveTenant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unitsApi.removeTenant(id).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: unitKeys.all }),
  });
}
