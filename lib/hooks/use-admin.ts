import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin.api';

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminApi.getStats().then((r) => r.data),
  });
}

export function useOrganisations(filters?: { search?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['admin', 'organisations', filters],
    queryFn: () => adminApi.listOrgs(filters).then((r) => r.data),
  });
}

export function useOrganisation(id: string) {
  return useQuery({
    queryKey: ['admin', 'organisations', id],
    queryFn: () => adminApi.getOrg(id).then((r) => r.data),
    enabled: !!id,
  });
}

export function useOrgUsers(orgId: string) {
  return useQuery({
    queryKey: ['admin', 'organisations', orgId, 'users'],
    queryFn: () => adminApi.listOrgUsers(orgId).then((r) => r.data),
    enabled: !!orgId,
  });
}

export function useCreateOrganisation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createOrg,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'organisations'] }),
  });
}

export function useUpdateOrg(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string }) => adminApi.updateOrg(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'organisations'] });
      qc.invalidateQueries({ queryKey: ['admin', 'organisations', id] });
    },
  });
}

export function useAddLandlordToOrg(orgId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; email: string; password: string }) =>
      adminApi.addLandlord(orgId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'organisations', orgId, 'users'] }),
  });
}

export function useDeactivateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => adminApi.deactivateUser(userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'organisations'] }),
  });
}

export function useActivateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => adminApi.activateUser(userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'organisations'] }),
  });
}

export function useNotificationQueue(filters?: { status?: string; limit?: number }) {
  return useQuery({
    queryKey: ['admin', 'notification-queue', filters],
    queryFn: () => adminApi.listQueue(filters).then((r) => r.data),
  });
}
