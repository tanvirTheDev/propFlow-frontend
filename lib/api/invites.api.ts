import { apiClient } from './client';
import type { TenantInvite, CreateInviteInput } from './types';

export const invitesApi = {
  list: () =>
    apiClient.get<TenantInvite[]>('/invites'),

  create: (data: CreateInviteInput) =>
    apiClient.post<TenantInvite>('/invites', data),

  resend: (id: string) =>
    apiClient.post<TenantInvite>(`/invites/${id}/resend`, {}),

  cancel: (id: string) =>
    apiClient.delete<{ success: boolean }>(`/invites/${id}`),
};
