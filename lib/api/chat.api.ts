import { apiClient } from './client';
import type { Message, MessagesPage, SendMessageInput, UnreadCountResponse } from './types';

export const chatApi = {
  list: (ticketId: string, params: { cursor?: string; limit?: number }): Promise<MessagesPage> =>
    apiClient.get(`/tickets/${ticketId}/messages`, { params }).then((r) => r.data),

  send: (ticketId: string, data: SendMessageInput): Promise<Message> =>
    apiClient.post(`/tickets/${ticketId}/messages`, data).then((r) => r.data),

  markAllRead: (ticketId: string): Promise<{ markedCount: number }> =>
    apiClient.post(`/tickets/${ticketId}/messages/read-all`).then((r) => r.data),

  unreadCount: (): Promise<UnreadCountResponse> =>
    apiClient.get('/messages/unread-count').then((r) => r.data),
};
