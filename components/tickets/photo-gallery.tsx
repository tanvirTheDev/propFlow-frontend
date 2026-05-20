'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export function PhotoGallery({ photos }: { photos: string[] }) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (!photos.length) return null;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {photos.map((url, i) => (
          <button key={i} type="button" onClick={() => setLightbox(url)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt=""
              className="h-24 w-24 rounded-md object-cover ring-1 ring-border hover:opacity-90 transition-opacity"
            />
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white"
            onClick={() => setLightbox(null)}
          >
            <X className="h-5 w-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt=""
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
