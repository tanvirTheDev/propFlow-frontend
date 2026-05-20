import { apiClient } from './client';

export const uploadApi = {
  ticketPhotos: (files: File[]): Promise<{ urls: string[] }> => {
    const form = new FormData();
    files.forEach((f) => form.append('files', f));
    return apiClient
      .post<{ urls: string[] }>('/upload/ticket-photos', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data as { urls: string[] });
  },

  chatPhoto: (file: File): Promise<{ url: string }> => {
    const form = new FormData();
    form.append('file', file);
    return apiClient
      .post<{ url: string }>('/upload/chat-photo', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data as { url: string });
  },
};
