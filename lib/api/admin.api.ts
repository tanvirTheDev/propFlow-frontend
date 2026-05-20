import { apiClient } from './client';
import type {
  AdminPlatformStats,
  OrgSummary,
  OrgDetail,
  OrgListResponse,
  OrgUser,
  CreateOrgInput,
  AddLandlordInput,
  NotificationQueueEntry,
} from './types';

export const adminApi = {
  getStats: () =>
    apiClient.get<AdminPlatformStats>('/admin/stats'),

  listOrgs: (params?: { search?: string; page?: number; limit?: number }) =>
    apiClient.get<OrgListResponse>('/admin/organisations', { params }),

  createOrg: (data: CreateOrgInput) =>
    apiClient.post<{ organisation: { id: string; name: string }; user: OrgUser }>('/admin/organisations', data),

  getOrg: (id: string) =>
    apiClient.get<OrgDetail>(`/admin/organisations/${id}`),

  updateOrg: (id: string, data: { name: string }) =>
    apiClient.patch<{ id: string; name: string }>(`/admin/organisations/${id}`, data),

  listOrgUsers: (orgId: string) =>
    apiClient.get<OrgUser[]>(`/admin/organisations/${orgId}/users`),

  addLandlord: (orgId: string, data: AddLandlordInput) =>
    apiClient.post<OrgUser>(`/admin/organisations/${orgId}/landlords`, data),

  deactivateUser: (userId: string) =>
    apiClient.delete<{ success: boolean }>(`/admin/users/${userId}`),

  activateUser: (userId: string) =>
    apiClient.post<{ success: boolean }>(`/admin/users/${userId}/activate`),

  listQueue: (params?: { status?: string; limit?: number }) =>
    apiClient.get<NotificationQueueEntry[]>('/admin/notification-queue', { params }),

  listRecentOrgs: () =>
    apiClient.get<OrgSummary[]>('/admin/organisations', { params: { limit: 5, page: 1 } }),
};
