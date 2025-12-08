import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/get-session';
import { createGladiaClient } from '@/lib/transcription/gladia-client';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json();
    const { audioUrl, storyId } = body;

    // Validate parameters
    if (!audioUrl || !storyId) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'audioUrl und storyId sind erforderlich',
          },
        },
        { status: 400 }
      );
    }

    // Verify story belongs to user
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      select: { authorId: true },
    });

    if (!story) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Geschichte nicht gefunden',
          },
        },
        { status: 404 }
      );
    }

    if (story.authorId !== userId) {
      return NextResponse.json(
        {
          error: {
            code: 'FORBIDDEN',
            message: 'Keine Berechtigung für diese Geschichte',
          },
        },
        { status: 403 }
      );
    }

    // Initialize Gladia client
    const gladiaClient = createGladiaClient();

    // Transcribe audio
    const transcriptionResult = await gladiaClient.transcribe(audioUrl);

    // Update story with transcription
    await prisma.story.update({
      where: { id: storyId },
      data: {
        content: transcriptionResult.text,
        transcriptionConfidence: transcriptionResult.confidence,
        transcriptionService: 'gladia',
        transcribedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      transcription: {
        text: transcriptionResult.text,
        confidence: transcriptionResult.confidence,
        language: transcriptionResult.language,
      },
    });
  } catch (error) {
    console.error('Transcription error:', error);

    // Return user-friendly error message
    const errorMessage =
      error instanceof Error ? error.message : 'Unbekannter Fehler';

    return NextResponse.json(
      {
        error: {
          code: 'TRANSCRIPTION_ERROR',
          message: 'Die Transkription ist fehlgeschlagen. Bitte geben Sie Ihren Text manuell ein.',
          details: errorMessage,
        },
      },
      { status: 500 }
    );
  }
}
