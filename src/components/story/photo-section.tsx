'use client';

import { usePhotoUpload } from '@/hooks/use-photo-upload';
import { PhotoUploader } from '@/components/photo/photo-uploader';
import { PhotoGrid } from '@/components/photo/photo-grid';

interface PhotoSectionProps {
  storyId?: string;
  className?: string;
}

export function PhotoSection({ storyId, className = '' }: PhotoSectionProps) {
  const {
    photos,
    isUploading,
    error,
    addPhotos,
    removePhoto,
    updateCaption,
    canAddMore,
  } = usePhotoUpload({ storyId });

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Section heading */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Fotos hinzufügen (optional)
        </h2>
        <p className="mt-1 text-base text-gray-600">
          Fügen Sie bis zu 5 Fotos zu Ihrer Geschichte hinzu. Fotos werden automatisch für Web und Druck optimiert.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg" role="alert">
          <p className="text-base text-red-800">{error}</p>
        </div>
      )}

      {/* Photo grid - show uploaded photos */}
      {photos.length > 0 && (
        <PhotoGrid
          photos={photos}
          onRemove={removePhoto}
          onCaptionChange={updateCaption}
        />
      )}

      {/* Upload area - show if can add more */}
      {canAddMore && (
        <PhotoUploader
          onFilesSelected={addPhotos}
          disabled={isUploading}
          maxPhotos={5}
          currentPhotoCount={photos.length}
        />
      )}
    </div>
  );
}
