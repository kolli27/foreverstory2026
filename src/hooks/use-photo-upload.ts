'use client';

import { useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import type { Photo, PhotoUploadResult } from '@/types/photo';

const MAX_PHOTOS = 5;

interface UsePhotoUploadOptions {
  storyId?: string;
  onUploadComplete?: (photos: Photo[]) => void;
}

interface UsePhotoUploadReturn {
  photos: Photo[];
  isUploading: boolean;
  error: string | null;
  addPhotos: (files: File[]) => Promise<void>;
  removePhoto: (photoId: string) => void;
  updateCaption: (photoId: string, caption: string) => void;
  canAddMore: boolean;
}

export function usePhotoUpload({
  storyId,
  onUploadComplete,
}: UsePhotoUploadOptions = {}): UsePhotoUploadReturn {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canAddMore = photos.length < MAX_PHOTOS;

  /**
   * Validate photo file
   */
  const validatePhoto = (file: File): { valid: boolean; error?: string } => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return {
        valid: false,
        error: 'Bitte wählen Sie ein Foto im JPG, PNG oder HEIC Format.',
      };
    }

    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Das Foto ist zu groß. Bitte wählen Sie ein Foto unter 20 MB.',
      };
    }

    return { valid: true };
  };

  /**
   * Resize image to specified max dimensions
   */
  const resizeImage = async (
    file: File,
    maxWidth: number,
    quality: number
  ): Promise<Blob> => {
    const options = {
      maxWidthOrHeight: maxWidth,
      useWebWorker: true,
      fileType: 'image/jpeg',
      initialQuality: quality,
    };

    return await imageCompression(file, options);
  };

  /**
   * Upload single photo to S3 (both web and print versions)
   */
  const uploadPhoto = async (file: File, photoId: string): Promise<PhotoUploadResult> => {
    // Resize for web (1920px max)
    const webBlob = await resizeImage(file, 1920, 0.85);

    // Resize for print (3000px for 300 DPI)
    const printBlob = await resizeImage(file, 3000, 0.92);

    // Get presigned URLs for both versions
    const webUrlResponse = await fetch(
      `/api/upload/presigned-url?fileType=photo&storyId=${storyId || 'temp'}&photoId=${photoId}&variant=web&contentType=${encodeURIComponent('image/jpeg')}`
    );

    if (!webUrlResponse.ok) {
      throw new Error('Failed to get upload URL for web version');
    }

    const webUrlData = await webUrlResponse.json();

    const printUrlResponse = await fetch(
      `/api/upload/presigned-url?fileType=photo&storyId=${storyId || 'temp'}&photoId=${photoId}&variant=print&contentType=${encodeURIComponent('image/jpeg')}`
    );

    if (!printUrlResponse.ok) {
      throw new Error('Failed to get upload URL for print version');
    }

    const printUrlData = await printUrlResponse.json();

    // Upload web version
    const webUploadResponse = await fetch(webUrlData.presignedUrl, {
      method: 'PUT',
      body: webBlob,
      headers: {
        'Content-Type': 'image/jpeg',
      },
    });

    if (!webUploadResponse.ok) {
      throw new Error('Failed to upload web version');
    }

    // Upload print version
    const printUploadResponse = await fetch(printUrlData.presignedUrl, {
      method: 'PUT',
      body: printBlob,
      headers: {
        'Content-Type': 'image/jpeg',
      },
    });

    if (!printUploadResponse.ok) {
      throw new Error('Failed to upload print version');
    }

    // Create object URLs for preview
    const webUrl = URL.createObjectURL(webBlob);
    const printUrl = URL.createObjectURL(printBlob);

    return {
      id: photoId,
      webUrl,
      printUrl,
      webKey: webUrlData.key,
      printKey: printUrlData.key,
    };
  };

  /**
   * Add new photos
   */
  const addPhotos = useCallback(
    async (files: File[]) => {
      // Check if we can add more photos
      const availableSlots = MAX_PHOTOS - photos.length;
      if (availableSlots <= 0) {
        setError(`Sie können maximal ${MAX_PHOTOS} Fotos hinzufügen.`);
        return;
      }

      // Limit to available slots
      const filesToUpload = files.slice(0, availableSlots);

      // Validate all files
      const validationErrors: string[] = [];
      const validFiles: File[] = [];

      for (const file of filesToUpload) {
        const validation = validatePhoto(file);
        if (validation.valid) {
          validFiles.push(file);
        } else if (validation.error) {
          validationErrors.push(validation.error);
        }
      }

      if (validationErrors.length > 0) {
        setError(validationErrors[0] || 'Ungültiges Foto');
        return;
      }

      if (validFiles.length === 0) {
        return;
      }

      setIsUploading(true);
      setError(null);

      // Create placeholder photos
      const newPhotos: Photo[] = validFiles.map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        webUrl: '',
        printUrl: '',
        file,
        uploadProgress: 0,
        isUploading: true,
      }));

      setPhotos((prev) => [...prev, ...newPhotos]);

      // Upload each photo
      for (const photo of newPhotos) {
        try {
          if (!photo.file) continue;

          const result = await uploadPhoto(photo.file, photo.id);

          // Update photo with URLs
          setPhotos((prev) =>
            prev.map((p) =>
              p.id === photo.id
                ? {
                    ...p,
                    webUrl: result.webUrl,
                    printUrl: result.printUrl,
                    uploadProgress: 100,
                    isUploading: false,
                  }
                : p
            )
          );
        } catch (err) {
          console.error('Photo upload error:', err);
          setPhotos((prev) =>
            prev.map((p) =>
              p.id === photo.id
                ? {
                    ...p,
                    error: 'Upload fehlgeschlagen',
                    isUploading: false,
                  }
                : p
            )
          );
        }
      }

      setIsUploading(false);

      // Call callback if provided
      const updatedPhotos = photos.filter((p) => !p.error);
      if (onUploadComplete) {
        onUploadComplete(updatedPhotos);
      }
    },
    [photos, storyId, onUploadComplete]
  );

  /**
   * Remove photo
   */
  const removePhoto = useCallback((photoId: string) => {
    setPhotos((prev) => {
      const photo = prev.find((p) => p.id === photoId);
      // Revoke object URLs to free memory
      if (photo) {
        if (photo.webUrl) URL.revokeObjectURL(photo.webUrl);
        if (photo.printUrl) URL.revokeObjectURL(photo.printUrl);
      }
      return prev.filter((p) => p.id !== photoId);
    });
  }, []);

  /**
   * Update photo caption
   */
  const updateCaption = useCallback((photoId: string, caption: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, caption } : p))
    );
  }, []);

  return {
    photos,
    isUploading,
    error,
    addPhotos,
    removePhoto,
    updateCaption,
    canAddMore,
  };
}
