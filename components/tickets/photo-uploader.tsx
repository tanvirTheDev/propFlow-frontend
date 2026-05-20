'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, ImagePlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface Props {
  value: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
}

export function PhotoUploader({ value, onChange, maxFiles = 3 }: Props) {
  const t = useTranslations('tickets.form');
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback(
    (accepted: File[]) => {
      const remaining = maxFiles - value.length;
      const toAdd = accepted.slice(0, remaining);
      const newPreviews = toAdd.map((f) => URL.createObjectURL(f));
      setPreviews((p) => [...p, ...newPreviews]);
      onChange([...value, ...toAdd]);
    },
    [value, maxFiles, onChange],
  );

  const remove = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setPreviews((p) => p.filter((_, i) => i !== index));
    onChange(value.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 5 * 1024 * 1024,
    maxFiles: maxFiles - value.length,
    disabled: value.length >= maxFiles,
  });

  return (
    <div className="space-y-3">
      {value.length < maxFiles && (
        <div
          {...getRootProps()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors',
            isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50',
          )}
        >
          <input {...getInputProps()} />
          <ImagePlus className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">{t('dragDrop')}</p>
          <p className="text-xs text-muted-foreground">{t('maxFiles')}</p>
        </div>
      )}

      {previews.length > 0 && (
        <div className="flex gap-2">
          {previews.map((src, i) => (
            <div key={i} className="relative h-20 w-20 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full rounded-md object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
