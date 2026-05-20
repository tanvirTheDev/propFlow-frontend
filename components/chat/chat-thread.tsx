'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';
import { Loader2, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ChatMessage } from './chat-message';
import { ChatInput } from './chat-input';
import { useMessages, useSendMessage, useMarkAllRead } from '@/lib/hooks/use-chat';
import { useAuthStore } from '@/lib/stores/auth.store';
import type { Message } from '@/lib/api/types';

function DateDivider({ date, today, yesterday }: { date: string; today: string; yesterday: string }) {
  const d = new Date(date);
  let label: string;
  if (isToday(d)) label = today;
  else if (isYesterday(d)) label = yesterday;
  else label = format(d, 'd MMM yyyy');

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

export function ChatThread({ ticketId }: { ticketId: string }) {
  const t = useTranslations('tickets');
  const user = useAuthStore((s) => s.user);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showNewPill, setShowNewPill] = useState(false);
  const [atBottom, setAtBottom] = useState(true);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useMessages(ticketId);
  const { mutate: send, isPending: isSending } = useSendMessage(ticketId);
  const { mutate: markRead } = useMarkAllRead(ticketId);

  const allMessages: Message[] = data?.pages.flatMap((p) => p.data) ?? [];

  // Mark all read on mount
  useEffect(() => { markRead(); }, [ticketId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll to bottom on new messages if already at bottom
  useEffect(() => {
    if (atBottom) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setShowNewPill(true);
    }
  }, [allMessages.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll to bottom on initial load
  useEffect(() => {
    if (!isLoading) bottomRef.current?.scrollIntoView();
  }, [isLoading]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const isBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    setAtBottom(isBottom);
    if (isBottom) setShowNewPill(false);

    if (el.scrollTop < 80 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleSend = (content: string, photo?: string) => {
    send(
      { content, photo },
      { onError: () => toast.error(t('sendError')) },
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-xl border">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex max-h-[420px] flex-col gap-3 overflow-y-auto p-4"
      >
        {isFetchingNextPage && (
          <div className="flex justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}

        {allMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
            <MessageCircle className="h-8 w-8" />
            <p className="text-sm">{t('chat.empty')}</p>
          </div>
        ) : (
          allMessages.map((msg, idx) => {
            const showDivider =
              idx === 0 ||
              !isSameDay(new Date(msg.createdAt), new Date(allMessages[idx - 1].createdAt));
            return (
              <div key={msg.id}>
                {showDivider && <DateDivider date={msg.createdAt} today={t('chat.today')} yesterday={t('chat.yesterday')} />}
                <ChatMessage message={msg} currentUserId={user?.id ?? ''} />
              </div>
            );
          })
        )}

        <div ref={bottomRef} />
      </div>

      {showNewPill && (
        <div className="flex justify-center pb-2">
          <Button
            size="sm"
            variant="secondary"
            className="h-7 rounded-full text-xs"
            onClick={() => {
              bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
              setShowNewPill(false);
            }}
          >
            {t('chat.newMessage')}
          </Button>
        </div>
      )}

      <ChatInput onSend={handleSend} isSending={isSending} />
    </div>
  );
}
