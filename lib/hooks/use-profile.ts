import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '@/lib/api/profile.api';
import { useAuthStore } from '@/lib/stores/auth.store';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.getProfile().then((r) => r.data),
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  const updateUser = useAuthStore((s) => s.updateUser);
  return useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['profile'] });
      const user = useAuthStore.getState().user;
      if (user) updateUser({ ...user, ...res.data });
    },
  });
}

export function useChangePassword() {
  return useMutation({ mutationFn: profileApi.changePassword });
}
