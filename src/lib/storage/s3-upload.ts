import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, S3_BUCKET } from './s3-client';

interface GeneratePresignedUrlParams {
  key: string;
  contentType: string;
  expiresIn?: number; // seconds
}

/**
 * Generate a presigned URL for uploading a file to S3
 */
export async function generatePresignedUploadUrl({
  key,
  contentType,
  expiresIn = 900, // 15 minutes default
}: GeneratePresignedUrlParams): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const presignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn,
  });

  return presignedUrl;
}

/**
 * Generate S3 key for audio file
 */
export function generateAudioKey(userId: string, storyId: string, extension: string): string {
  const timestamp = Date.now();
  return `audio/${userId}/${storyId}/recording-${timestamp}.${extension}`;
}

/**
 * Generate S3 key for photo file
 */
export function generatePhotoKey(
  userId: string,
  storyId: string,
  photoId: string,
  variant: 'web' | 'print'
): string {
  return `photos/${userId}/${storyId}/${photoId}-${variant}.jpg`;
}

/**
 * Get public URL for an S3 object
 */
export function getPublicUrl(key: string): string {
  if (process.env.S3_ENDPOINT) {
    // For S3-compatible services
    return `${process.env.S3_ENDPOINT}/${S3_BUCKET}/${key}`;
  }

  // For AWS S3
  const region = process.env.AWS_REGION || 'eu-central-1';
  return `https://${S3_BUCKET}.s3.${region}.amazonaws.com/${key}`;
}
