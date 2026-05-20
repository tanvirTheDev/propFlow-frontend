'use client';

import { useState } from 'react';
import { uploadApi } from '@/lib/api/upload.api';

export function useUploadTicketPhotos() {
  const [isUploading, setIsUploading] = useState(false);

  const upload = async (files: File[]): Promise<string[]> => {
    if (!files.length) return [];
    setIsUploading(true);
    try {
      const result = await uploadApi.ticketPhotos(files);
      return result.urls;
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading };
}

export function useUploadChatPhoto() {
  const [isUploading, setIsUploading] = useState(false);

  const upload = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const result = await uploadApi.chatPhoto(file);
      return result.url;
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading };
}
