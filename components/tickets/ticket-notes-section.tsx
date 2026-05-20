'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTicketNotes, useCreateTicketNote } from '@/lib/hooks/use-tickets';

export function TicketNotesSection({ ticketId }: { ticketId: string }) {
  const t = useTranslations('tickets.detail');
  const tCommon = useTranslations('common');
  const [content, setContent] = useState('');
  const { data: notes, isLoading } = useTicketNotes(ticketId);
  const { mutate: createNote, isPending } = useCreateTicketNote(ticketId);

  const submit = () => {
    if (!content.trim()) return;
    createNote(content.trim(), {
      onSuccess: () => { toast.success('Note saved'); setContent(''); },
      onError: () => toast.error(tCommon('error')),
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Textarea
          placeholder={t('notePlaceholder')}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
        <Button size="sm" onClick={submit} disabled={isPending || !content.trim()}>
          {t('saveNote')}
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">{tCommon('loading')}</p>
      ) : !notes?.length ? (
        <p className="text-sm text-muted-foreground">{t('noNotes')}</p>
      ) : (
        <div className="space-y-3">
          {[...notes].reverse().map((note) => (
            <div key={note.id} className="rounded-lg border bg-muted/30 p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">{note.author.name}</span>
                <time className="text-xs text-muted-foreground">
                  {format(new Date(note.createdAt), 'dd MMM yyyy, HH:mm')}
                </time>
              </div>
              <p className="text-sm whitespace-pre-wrap">{note.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
