'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ticketsApi } from '@/lib/api/tickets.api';
import type { CreateTicketInput, ListTicketsParams } from '@/lib/api/types';

export const ticketKeys = {
  all: ['tickets'] as const,
  list: (p?: ListTicketsParams) => [...ticketKeys.all, 'list', p] as const,
  detail: (id: string) => [...ticketKeys.all, 'detail', id] as const,
  notes: (id: string) => [...ticketKeys.all, 'notes', id] as const,
  unitHistory: (unitId: string) => [...ticketKeys.all, 'unit-history', unitId] as const,
};

export function useTickets(params?: ListTicketsParams) {
  return useQuery({
    queryKey: ticketKeys.list(params),
    queryFn: () => ticketsApi.list(params).then((r) => r.data),
  });
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: ticketKeys.detail(id),
    queryFn: () => ticketsApi.get(id).then((r) => r.data),
    enabled: Boolean(id),
  });
}

export function useCreateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTicketInput) => ticketsApi.create(data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ticketKeys.all }),
  });
}

export function useUpdateTicketStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ticketsApi.updateStatus(id, status).then((r) => r.data),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ticketKeys.detail(id) });
      qc.invalidateQueries({ queryKey: ticketKeys.list() });
    },
  });
}

export function useTicketNotes(ticketId: string) {
  return useQuery({
    queryKey: ticketKeys.notes(ticketId),
    queryFn: () => ticketsApi.getNotes(ticketId).then((r) => r.data),
    enabled: Boolean(ticketId),
  });
}

export function useCreateTicketNote(ticketId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) =>
      ticketsApi.createNote(ticketId, content).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ticketKeys.notes(ticketId) }),
  });
}

export function useRepairHistory(unitId: string) {
  return useQuery({
    queryKey: ticketKeys.unitHistory(unitId),
    queryFn: () => ticketsApi.getUnitHistory(unitId).then((r) => r.data),
    enabled: Boolean(unitId),
  });
}
