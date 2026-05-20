import { apiClient } from './client';
import type { Unit, CreateUnitInput } from './types';

export const unitsApi = {
  listByProperty: (propertyId: string) =>
    apiClient.get<Unit[]>(`/properties/${propertyId}/units`),

  get: (id: string) =>
    apiClient.get<Unit>(`/units/${id}`),

  getMyUnit: () =>
    apiClient.get<Unit>('/units/my-unit'),

  create: (propertyId: string, data: CreateUnitInput) =>
    apiClient.post<Unit>(`/properties/${propertyId}/units`, data),

  update: (id: string, data: Partial<CreateUnitInput>) =>
    apiClient.patch<Unit>(`/units/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<{ success: boolean }>(`/units/${id}`),

  removeTenant: (id: string) =>
    apiClient.delete<Unit>(`/units/${id}/tenant`),
};
