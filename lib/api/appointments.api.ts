import { apiClient } from './client';
import type {
  Appointment,
  AppointmentFilters,
  CreateAppointmentInput,
  CreateAppointmentResponse,
  UpdateAppointmentInput,
} from './types';

export const appointmentsApi = {
  create: (ticketId: string, data: CreateAppointmentInput): Promise<CreateAppointmentResponse> =>
    apiClient.post(`/tickets/${ticketId}/appointments`, data).then((r) => r.data),

  list: (filters: AppointmentFilters): Promise<Appointment[]> =>
    apiClient.get('/appointments', { params: filters }).then((r) => r.data),

  upcoming: (): Promise<Appointment[]> =>
    apiClient.get('/appointments/upcoming').then((r) => r.data),

  findOne: (id: string): Promise<Appointment> =>
    apiClient.get(`/appointments/${id}`).then((r) => r.data),

  update: (id: string, data: UpdateAppointmentInput): Promise<Appointment> =>
    apiClient.patch(`/appointments/${id}`, data).then((r) => r.data),

  complete: (id: string, note?: string): Promise<Appointment> =>
    apiClient.post(`/appointments/${id}/complete`, { note }).then((r) => r.data),

  cancel: (id: string, reason?: string): Promise<Appointment> =>
    apiClient.post(`/appointments/${id}/cancel`, { reason }).then((r) => r.data),
};
