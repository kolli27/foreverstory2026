/**
 * Photo types for story submission
 */

export interface Photo {
  id: string;
  webUrl: string; // S3 URL for web display (1920px max)
  printUrl: string; // S3 URL for print (3000px for 300 DPI)
  caption?: string;
  file?: File; // Original file (for upload progress)
  uploadProgress?: number; // 0-100
  isUploading?: boolean;
  error?: string;
}

export interface PhotoUploadResult {
  id: string;
  webUrl: string;
  printUrl: string;
  webKey: string;
  printKey: string;
}

export interface ResizedImage {
  blob: Blob;
  width: number;
  height: number;
}
