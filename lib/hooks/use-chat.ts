'use client';

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '@/lib/api/chat.api';
import { useAuthStore } from '@/lib/stores/auth.store';
import type { Message, SendMessageInput } from '@/lib/api/types';

export function useMessages(ticketId: string) {
  return useInfiniteQuery({
    queryKey: ['messages', ticketId],
    queryFn: ({ pageParam }) =>
      chatApi.list(ticketId, { cursor: pageParam as string | undefined }),
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    staleTime: 30 * 1000,
  });
}

export function useSendMessage(ticketId: string) {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: (data: SendMessageInput) => chatApi.send(ticketId, data),
    onMutate: async (newMsg) => {
      await queryClient.cancelQueries({ queryKey: ['messages', ticketId] });
      const prev = queryClient.getQueryData(['messages', ticketId]);

      const optimistic: Message = {
        id: `optimistic-${Date.now()}`,
        orgId: '',
        ticketId,
        senderId: currentUser?.id ?? '',
        type: 'USER_MESSAGE',
        content: newMsg.content,
        photo: newMsg.photo ?? null,
        systemKey: null,
        systemData: null,
        createdAt: new Date().toISOString(),
        sender: { id: currentUser?.id ?? '', name: currentUser?.name ?? '' },
        reads: [],
      };

      queryClient.setQueryData(['messages', ticketId], (old: unknown) => {
        if (!old) return old;
        const pages = (old as { pages: { data: Message[] }[] }).pages;
        return {
          ...(old as object),
          pages: pages.map((p, i) =>
            i === pages.length - 1 ? { ...p, data: [...p.data, optimistic] } : p,
          ),
        };
      });

      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['messages', ticketId], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });
}

export function useMarkAllRead(ticketId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => chatApi.markAllRead(ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['unread-count'],
    queryFn: chatApi.unreadCount,
    refetchInterval: 30 * 1000,
    staleTime: 20 * 1000,
  });
}
