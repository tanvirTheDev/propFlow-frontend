import { apiClient } from './client';
import type { ProfileUser, UpdateProfileInput, ChangePasswordInput } from './types';

export const profileApi = {
  getProfile: () =>
    apiClient.get<ProfileUser>('/users/me/profile'),

  updateProfile: (data: UpdateProfileInput) =>
    apiClient.patch<ProfileUser>('/users/me/profile', data),

  changePassword: (data: ChangePasswordInput) =>
    apiClient.patch<{ success: boolean }>('/users/me/password', data),
};
