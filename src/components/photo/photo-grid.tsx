'use client';

import type { Photo } from '@/types/photo';

interface PhotoGridProps {
  photos: Photo[];
  onRemove: (photoId: string) => void;
  onCaptionChange: (photoId: string, caption: string) => void;
  className?: string;
}

export function PhotoGrid({
  photos,
  onRemove,
  onCaptionChange,
  className = '',
}: PhotoGridProps) {
  if (photos.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900">
        Hochgeladene Fotos ({photos.length})
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="border-2 border-gray-200 rounded-lg p-4 space-y-3 bg-white"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gray-100 rounded overflow-hidden">
              {photo.isUploading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Wird hochgeladen...</p>
                  </div>
                </div>
              ) : photo.error ? (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50">
                  <div className="text-center px-4">
                    <svg
                      className="w-12 h-12 text-red-500 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm text-red-600">{photo.error}</p>
                  </div>
                </div>
              ) : (
                <img
                  src={photo.webUrl}
                  alt={photo.caption || 'Hochgeladenes Foto'}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Caption input */}
            <div>
              <label
                htmlFor={`caption-${photo.id}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Bildunterschrift (optional)
              </label>
              <input
                id={`caption-${photo.id}`}
                type="text"
                value={photo.caption || ''}
                onChange={(e) => onCaptionChange(photo.id, e.target.value)}
                placeholder="Beschreiben Sie dieses Foto..."
                disabled={photo.isUploading || !!photo.error}
                className="
                  w-full px-3 py-2 text-base border-2 border-gray-200 rounded
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
                  disabled:bg-gray-100 disabled:cursor-not-allowed
                "
              />
            </div>

            {/* Remove button */}
            <button
              onClick={() => onRemove(photo.id)}
              disabled={photo.isUploading}
              className="
                w-full px-4 py-2 text-base font-medium text-red-600 border-2 border-red-300
                hover:bg-red-50 rounded transition-colors min-h-[44px]
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              Foto entfernen
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
