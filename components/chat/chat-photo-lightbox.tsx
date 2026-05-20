'use client';

import { useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  src: string;
  onClose: () => void;
}

export function ChatPhotoLightbox({ src, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt="Chat photo" className="max-h-[85vh] max-w-[85vw] rounded-lg object-contain" />
        <div className="absolute right-2 top-2 flex gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8"
            asChild
          >
            <a href={src} download target="_blank" rel="noreferrer">
              <Download className="h-4 w-4" />
            </a>
          </Button>
          <Button size="icon" variant="secondary" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
