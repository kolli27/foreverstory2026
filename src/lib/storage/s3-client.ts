import { S3Client } from '@aws-sdk/client-s3';

// Initialize S3 client
// Supports both AWS S3 and S3-compatible services (Hetzner, Wasabi)
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'eu-central-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  // Optional: For S3-compatible services
  ...(process.env.S3_ENDPOINT && {
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: true,
  }),
});

export const S3_BUCKET = process.env.S3_BUCKET || 'foreverstory-dev';
