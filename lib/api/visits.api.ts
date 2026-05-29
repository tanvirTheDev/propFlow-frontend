import { apiClient } from './client';
import type { LandlordVisit, CreateVisitPayload } from './types';

export const visitsApi = {
  list: (params?: {
    from?: string;
    to?: string;
    status?: string;
    propertyId?: string;
  }): Promise<LandlordVisit[]> =>
    apiClient.get('/visits', { params }).then((r) => r.data),

  get: (id: string): Promise<LandlordVisit> =>
    apiClient.get(`/visits/${id}`).then((r) => r.data),

  create: (data: CreateVisitPayload): Promise<{ visit: LandlordVisit; warning?: '24h_notice' }> =>
    apiClient.post('/visits', data).then((r) => r.data),

  update: (
    id: string,
    data: Partial<CreateVisitPayload>,
  ): Promise<{ visit: LandlordVisit; warning?: '24h_notice' }> =>
    apiClient.patch(`/visits/${id}`, data).then((r) => r.data),

  complete: (id: string, note?: string, endTime?: string): Promise<LandlordVisit> =>
    apiClient.post(`/visits/${id}/complete`, { note, endTime }).then((r) => r.data),

  cancel: (id: string, reason?: string): Promise<LandlordVisit> =>
    apiClient.post(`/visits/${id}/cancel`, { reason }).then((r) => r.data),
};
