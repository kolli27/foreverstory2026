'use client';

import { useRef, useState } from 'react';

interface PhotoUploaderProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
  maxPhotos?: number;
  currentPhotoCount?: number;
  className?: string;
}

export function PhotoUploader({
  onFilesSelected,
  disabled = false,
  maxPhotos = 5,
  currentPhotoCount = 0,
  className = '',
}: PhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableSlots = maxPhotos - currentPhotoCount;
  const canUpload = availableSlots > 0 && !disabled;

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (canUpload) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!canUpload) return;

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) =>
      file.type.startsWith('image/')
    );

    if (imageFiles.length > 0) {
      onFilesSelected(imageFiles);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !canUpload) return;

    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }

    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleButtonClick = () => {
    if (canUpload) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={className}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/heic,image/heif"
        multiple
        onChange={handleFileInputChange}
        className="sr-only"
        disabled={!canUpload}
      />

      {/* Drop zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-4 border-dashed rounded-lg p-12 text-center transition-all
          ${
            isDragging && canUpload
              ? 'border-blue-500 bg-blue-50'
              : canUpload
              ? 'border-gray-300 hover:border-gray-400'
              : 'border-gray-200 bg-gray-50'
          }
        `}
      >
        {/* Photo icon */}
        <svg
          className={`w-16 h-16 mx-auto ${
            canUpload ? 'text-gray-400' : 'text-gray-300'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>

        {/* Instructions */}
        <p className="mt-4 text-lg font-medium text-gray-700">
          Ziehen Sie Fotos hierher oder klicken Sie zum Auswählen
        </p>

        {canUpload && (
          <p className="mt-2 text-base text-gray-500">
            JPG, PNG oder HEIC • Max. 20 MB pro Foto
          </p>
        )}

        {/* Status message */}
        {!canUpload && currentPhotoCount >= maxPhotos && (
          <p className="mt-2 text-base text-amber-600" role="status">
            Maximale Anzahl von {maxPhotos} Fotos erreicht
          </p>
        )}

        {canUpload && (
          <p className="mt-2 text-sm text-gray-500">
            {availableSlots === 1
              ? 'Noch 1 Foto möglich'
              : `Noch ${availableSlots} Fotos möglich`}
          </p>
        )}

        {/* Upload button */}
        <button
          onClick={handleButtonClick}
          disabled={!canUpload}
          className="
            mt-6 px-8 py-4 text-lg font-medium rounded-lg transition-colors min-h-[44px]
            bg-blue-600 hover:bg-blue-700 text-white
            disabled:bg-gray-300 disabled:cursor-not-allowed
          "
        >
          Fotos auswählen
        </button>
      </div>
    </div>
  );
}
