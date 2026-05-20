'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Paperclip, Send, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUploadChatPhoto } from '@/lib/hooks/use-upload';

interface Props {
  onSend: (content: string, photo?: string) => void;
  isSending: boolean;
}

export function ChatInput({ onSend, isSending }: Props) {
  const t = useTranslations('tickets.chat');
  const [text, setText] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading } = useUploadChatPhoto();

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed && !photoUrl) return;
    onSend(trimmed || '📷', photoUrl ?? undefined);
    setText('');
    setPhotoUrl(null);
    setPhotoPreview(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    try {
      const url = await upload(file);
      setPhotoUrl(url);
    } catch {
      toast.error(t('uploadFailed'));
      setPhotoPreview(null);
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  const removePhoto = () => {
    setPhotoUrl(null);
    setPhotoPreview(null);
  };

  const disabled = isSending || isUploading;
  const canSend = (text.trim().length > 0 || photoUrl !== null) && !disabled;

  return (
    <div className="border-t p-3">
      {photoPreview && (
        <div className="relative mb-2 inline-block">
          <img src={photoPreview} alt="Preview" className="h-20 w-20 rounded-lg object-cover" />
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 text-xs text-white">
              {t('uploading')}
            </div>
          )}
          {!isUploading && (
            <button
              onClick={removePhoto}
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}

      <div className="flex items-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => fileRef.current?.click()}
          disabled={disabled}
          type="button"
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('inputPlaceholder')}
          className="min-h-10 max-h-30 resize-none"
          rows={1}
          disabled={disabled}
        />

        <Button
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={handleSend}
          disabled={!canSend}
          type="button"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
