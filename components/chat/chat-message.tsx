'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ChatSystemMessage } from './chat-system-message';
import { ChatReadReceipt } from './chat-read-receipt';
import { ChatPhotoLightbox } from './chat-photo-lightbox';
import type { Message } from '@/lib/api/types';

interface Props {
  message: Message;
  currentUserId: string;
}

export function ChatMessage({ message, currentUserId }: Props) {
  const [lightbox, setLightbox] = useState(false);

  if (message.type === 'SYSTEM_MESSAGE') {
    return <ChatSystemMessage message={message} />;
  }

  const isSelf = message.senderId === currentUserId;
  const isOptimistic = message.id.startsWith('optimistic-');
  const hasRead = message.reads.some((r) => r.userId !== currentUserId);
  const receiptStatus = isOptimistic ? 'sending' : hasRead ? 'read' : 'sent';

  return (
    <div className={`flex items-end gap-2 ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isSelf && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
          {message.sender?.name?.[0]?.toUpperCase() ?? '?'}
        </div>
      )}

      <div className={`flex max-w-[70%] flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
        {!isSelf && (
          <span className="mb-1 text-xs text-muted-foreground">{message.sender?.name}</span>
        )}

        <div
          className={`rounded-2xl px-4 py-3 text-sm ${
            isSelf
              ? 'rounded-br-sm bg-primary text-primary-foreground'
              : 'rounded-bl-sm bg-secondary text-secondary-foreground'
          }`}
        >
          {message.photo && (
            <div className="mb-2">
              <img
                src={message.photo}
                alt="Attachment"
                className="max-h-48 max-w-[200px] cursor-pointer rounded-lg object-cover"
                onClick={() => setLightbox(true)}
              />
            </div>
          )}
          {message.content && (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          )}
        </div>

        <div className={`mt-1 flex items-center gap-1 ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-[10px] text-muted-foreground">
            {format(new Date(message.createdAt), 'HH:mm')}
          </span>
          {isSelf && <ChatReadReceipt status={receiptStatus} />}
        </div>
      </div>

      {lightbox && message.photo && (
        <ChatPhotoLightbox src={message.photo} onClose={() => setLightbox(false)} />
      )}
    </div>
  );
}
