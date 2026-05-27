import { apiClient } from './client';
import type {
  AuthResponse,
  TokenResponse,
  LoginInput,
  RegisterInput,
  AcceptInviteInput,
  User,
  InviteDetails,
} from './types';

export const authApi = {
  login: (data: LoginInput) =>
    apiClient.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  register: (data: RegisterInput) =>
    apiClient.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  refresh: (refreshToken: string) =>
    apiClient.post<TokenResponse>('/auth/refresh', { refreshToken }).then((r) => r.data),

  logout: () => apiClient.post('/auth/logout').then((r) => r.data),

  me: () => apiClient.get<User>('/auth/me').then((r) => r.data),

  getInvite: (token: string) =>
    apiClient.get<InviteDetails>(`/auth/invite/${token}`).then((r) => r.data),

  acceptInvite: (data: AcceptInviteInput) =>
    apiClient.post<AuthResponse>('/auth/accept-invite', data).then((r) => r.data),

  forgotPassword: (email: string) =>
    apiClient.post<{ message: string }>('/auth/forgot-password', { email }).then((r) => r.data),

  resetPassword: (data: { email: string; code: string; newPassword: string }) =>
    apiClient.post<{ message: string }>('/auth/reset-password', data).then((r) => r.data),
};
