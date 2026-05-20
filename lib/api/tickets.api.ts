import { apiClient } from './client';
import type {
  Ticket,
  TicketNote,
  CreateTicketInput,
  ListTicketsParams,
  PaginatedResponse,
} from './types';

export const ticketsApi = {
  list: (params?: ListTicketsParams) =>
    apiClient.get<PaginatedResponse<Ticket>>('/tickets', { params }),

  get: (id: string) =>
    apiClient.get<Ticket>(`/tickets/${id}`),

  create: (data: CreateTicketInput) =>
    apiClient.post<Ticket>('/tickets', data),

  updateStatus: (id: string, status: string) =>
    apiClient.patch<Ticket>(`/tickets/${id}/status`, { status }),

  getNotes: (ticketId: string) =>
    apiClient.get<TicketNote[]>(`/tickets/${ticketId}/notes`),

  createNote: (ticketId: string, content: string) =>
    apiClient.post<TicketNote>(`/tickets/${ticketId}/notes`, { content }),

  getUnitHistory: (unitId: string) =>
    apiClient.get<Ticket[]>(`/units/${unitId}/ticket-history`),
};
