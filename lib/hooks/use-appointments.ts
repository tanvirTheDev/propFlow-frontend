'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appointmentsApi } from '@/lib/api/appointments.api';
import type { AppointmentFilters, CreateAppointmentInput, UpdateAppointmentInput } from '@/lib/api/types';

export function useAppointments(filters: AppointmentFilters = {}) {
  return useQuery({
    queryKey: ['appointments', filters],
    queryFn: () => appointmentsApi.list(filters),
  });
}

export function useUpcomingAppointments() {
  return useQuery({
    queryKey: ['appointments', 'upcoming'],
    queryFn: appointmentsApi.upcoming,
    staleTime: 60 * 1000,
  });
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: () => appointmentsApi.findOne(id),
    enabled: !!id,
  });
}

export function useCreateAppointment(ticketId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAppointmentInput) => appointmentsApi.create(ticketId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useUpdateAppointment(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateAppointmentInput) => appointmentsApi.update(id, data),
    onSuccess: (appt) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['ticket', appt.ticketId] });
    },
  });
}

export function useCompleteAppointment(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (note?: string) => appointmentsApi.complete(id, note),
    onSuccess: (appt) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['ticket', appt.ticketId] });
    },
  });
}

export function useCancelAppointment(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reason?: string) => appointmentsApi.cancel(id, reason),
    onSuccess: (appt) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['ticket', appt.ticketId] });
    },
  });
}
