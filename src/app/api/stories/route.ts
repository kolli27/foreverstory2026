import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Nicht autorisiert' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { questionId, content, status, inputMode, storyId } = body;

    // Validation
    if (!questionId || !content || !status || !inputMode) {
      return NextResponse.json(
        { error: 'Fehlende erforderliche Felder' },
        { status: 400 }
      );
    }

    // Calculate word count
    const words = content.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // TODO: Get subscriptionId from user's active subscription
    // For now, we'll need to fetch or create a test subscription
    // This will be implemented when we build the subscription system

    if (storyId) {
      // Update existing draft
      const story = await prisma.story.update({
        where: { id: storyId },
        data: {
          content,
          status,
          inputMode,
          wordCount,
          submittedAt: status === 'SUBMITTED' ? new Date() : null,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json(story);
    } else {
      // Create new story
      // For MVP, we'll need a mock subscriptionId
      // In production, fetch from user's active subscription
      const mockSubscriptionId = 'mock-subscription-' + session.user.id;

      const story = await prisma.story.create({
        data: {
          authorId: session.user.id,
          subscriptionId: mockSubscriptionId, // TODO: Get real subscription
          questionId,
          content,
          status,
          inputMode,
          wordCount,
          submittedAt: status === 'SUBMITTED' ? new Date() : null,
        },
      });

      return NextResponse.json(story);
    }
  } catch (error) {
    console.error('Error saving story:', error);
    return NextResponse.json(
      { error: 'Fehler beim Speichern der Geschichte' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get authenticated user
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Nicht autorisiert' },
        { status: 401 }
      );
    }

    // Fetch user's stories
    const stories = await prisma.story.findMany({
      where: {
        authorId: session.user.id,
      },
      include: {
        question: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Geschichten' },
      { status: 500 }
    );
  }
}
