import { apiClient } from './client';
import type { LandlordStats, AdminStats } from './types';

export const dashboardApi = {
  landlord: () =>
    apiClient.get<LandlordStats>('/dashboard/landlord'),

  admin: () =>
    apiClient.get<AdminStats>('/dashboard/admin'),
};
