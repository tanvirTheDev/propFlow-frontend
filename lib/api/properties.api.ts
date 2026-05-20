import { apiClient } from './client';
import type {
  Property,
  PaginatedResponse,
  CreatePropertyInput,
  PropertyMapData,
} from './types';

export interface ListPropertiesParams {
  search?: string;
  city?: string;
  page?: number;
  limit?: number;
}

export const propertiesApi = {
  list: (params?: ListPropertiesParams) =>
    apiClient.get<PaginatedResponse<Property>>('/properties', { params }),

  get: (id: string) =>
    apiClient.get<Property>(`/properties/${id}`),

  create: (data: CreatePropertyInput) =>
    apiClient.post<Property>('/properties', data),

  update: (id: string, data: Partial<CreatePropertyInput>) =>
    apiClient.patch<Property>(`/properties/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<{ success: boolean }>(`/properties/${id}`),

  mapData: () =>
    apiClient.get<PropertyMapData>('/properties/map'),

  retryGeocode: (id: string) =>
    apiClient.post<Property>(`/properties/${id}/geocode`),
};
