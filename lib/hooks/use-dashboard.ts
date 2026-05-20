import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api/dashboard.api';

export function useLandlordDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'landlord'],
    queryFn: () => dashboardApi.landlord().then((r) => r.data),
  });
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'admin'],
    queryFn: () => dashboardApi.admin().then((r) => r.data),
  });
}
