import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/get-session';
import { generatePresignedUploadUrl, generateAudioKey, generatePhotoKey } from '@/lib/storage/s3-upload';

export async function GET(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Nicht autorisiert' } },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const fileType = searchParams.get('fileType'); // 'audio' or 'photo'
    const storyId = searchParams.get('storyId');
    const contentType = searchParams.get('contentType');

    // Validate parameters
    if (!fileType || !storyId || !contentType) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Fehlende Parameter: fileType, storyId und contentType sind erforderlich',
          },
        },
        { status: 400 }
      );
    }

    if (fileType !== 'audio' && fileType !== 'photo') {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Ungültiger fileType. Erlaubt sind: audio, photo',
          },
        },
        { status: 400 }
      );
    }

    // Generate S3 key
    let key: string;
    if (fileType === 'audio') {
      // Determine file extension from content type
      let extension = 'webm';
      if (contentType.includes('mp4')) {
        extension = 'mp4';
      } else if (contentType.includes('wav')) {
        extension = 'wav';
      }
      key = generateAudioKey(userId, storyId, extension);
    } else {
      // For photos, expect photoId and variant in query params
      const photoId = searchParams.get('photoId');
      const variant = searchParams.get('variant') as 'web' | 'print';

      if (!photoId || !variant) {
        return NextResponse.json(
          {
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Für Fotos sind photoId und variant erforderlich',
            },
          },
          { status: 400 }
        );
      }

      key = generatePhotoKey(userId, storyId, photoId, variant);
    }

    // Generate presigned URL
    const presignedUrl = await generatePresignedUploadUrl({
      key,
      contentType,
      expiresIn: 900, // 15 minutes
    });

    return NextResponse.json({
      presignedUrl,
      key,
    });
  } catch (error) {
    console.error('Presigned URL generation error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Fehler beim Erstellen der Upload-URL',
        },
      },
      { status: 500 }
    );
  }
}
