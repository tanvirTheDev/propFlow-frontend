import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { propertiesApi, type ListPropertiesParams } from '@/lib/api/properties.api';
import type { CreatePropertyInput } from '@/lib/api/types';

export const propertyKeys = {
  all: ['properties'] as const,
  list: (params?: ListPropertiesParams) => [...propertyKeys.all, 'list', params] as const,
  detail: (id: string) => [...propertyKeys.all, 'detail', id] as const,
};

export function useProperties(params?: ListPropertiesParams) {
  return useQuery({
    queryKey: propertyKeys.list(params),
    queryFn: () => propertiesApi.list(params).then((r) => r.data),
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: () => propertiesApi.get(id).then((r) => r.data),
    enabled: Boolean(id),
  });
}

export function useCreateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePropertyInput) => propertiesApi.create(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: propertyKeys.all }),
  });
}

export function useUpdateProperty(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CreatePropertyInput>) =>
      propertiesApi.update(id, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: propertyKeys.detail(id) });
      qc.invalidateQueries({ queryKey: propertyKeys.list() });
    },
  });
}

export function useDeleteProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => propertiesApi.delete(id).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: propertyKeys.all }),
  });
}

export function usePropertyMapData() {
  return useQuery({
    queryKey: [...propertyKeys.all, 'map'],
    queryFn: () => propertiesApi.mapData().then((r) => r.data),
  });
}

export function useRetryGeocode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => propertiesApi.retryGeocode(id).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: propertyKeys.all }),
  });
}
