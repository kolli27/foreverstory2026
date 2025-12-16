/**
 * Dashboard Data Fetching
 * Server-side functions to fetch dashboard data for story authors
 */

import { prisma } from '@/lib/prisma';
import { QuestionCategory, SubscriptionPlan, SubscriptionStatus, StoryStatus } from '@prisma/client';

// ============================================
// Type Definitions
// ============================================

export interface DashboardSubscription {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  daysRemaining: number | null;
  endDate: Date | null;
}

export interface DashboardQuestion {
  id: string;
  textDe: string;
  category: QuestionCategory;
  deliveryId: string;
}

export interface DashboardProgress {
  answeredCount: number;
  totalQuestions: number;
  percentComplete: number;
}

export interface DashboardStory {
  id: string;
  title: string | null;
  questionText: string;
  createdAt: Date;
  wordCount: number;
  hasAudio: boolean;
  hasPhotos: boolean;
  status: StoryStatus;
}

export interface DashboardData {
  subscription: DashboardSubscription | null;
  currentQuestion: DashboardQuestion | null;
  progress: DashboardProgress;
  recentStories: DashboardStory[];
}

// ============================================
// Helper Functions
// ============================================

/**
 * Calculate days remaining in subscription
 */
function calculateDaysRemaining(endDate: Date | null): number | null {
  if (!endDate) return null;

  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
}

// ============================================
// Data Fetching Functions
// ============================================

/**
 * Get active subscription for user
 */
async function getActiveSubscription(userId: string): Promise<DashboardSubscription | null> {
  const subscription = await prisma.subscription.findFirst({
    where: {
      storyAuthorId: userId,
      status: SubscriptionStatus.ACTIVE,
    },
    select: {
      id: true,
      plan: true,
      status: true,
      endDate: true,
    },
  });

  if (!subscription) return null;

  return {
    id: subscription.id,
    plan: subscription.plan,
    status: subscription.status,
    daysRemaining: calculateDaysRemaining(subscription.endDate),
    endDate: subscription.endDate,
  };
}

/**
 * Get current unanswered question for user's subscription
 */
async function getCurrentQuestion(subscriptionId: string): Promise<DashboardQuestion | null> {
  const delivery = await prisma.questionDelivery.findFirst({
    where: {
      subscriptionId,
      answeredAt: null,
      skippedAt: null,
    },
    include: {
      question: {
        select: {
          id: true,
          textDe: true,
          category: true,
        },
      },
    },
    orderBy: {
      deliveredAt: 'asc',
    },
  });

  if (!delivery || !delivery.question) return null;

  return {
    id: delivery.question.id,
    textDe: delivery.question.textDe,
    category: delivery.question.category,
    deliveryId: delivery.id,
  };
}

/**
 * Get progress statistics
 */
async function getProgressStats(subscriptionId: string): Promise<DashboardProgress> {
  const [totalDeliveries, answeredDeliveries] = await Promise.all([
    prisma.questionDelivery.count({
      where: { subscriptionId },
    }),
    prisma.questionDelivery.count({
      where: {
        subscriptionId,
        answeredAt: { not: null },
      },
    }),
  ]);

  const percentComplete = totalDeliveries > 0
    ? Math.round((answeredDeliveries / totalDeliveries) * 100)
    : 0;

  return {
    answeredCount: answeredDeliveries,
    totalQuestions: totalDeliveries,
    percentComplete,
  };
}

/**
 * Get recent stories (last 5)
 */
async function getRecentStories(userId: string, subscriptionId: string): Promise<DashboardStory[]> {
  const stories = await prisma.story.findMany({
    where: {
      authorId: userId,
      subscriptionId,
    },
    include: {
      question: {
        select: {
          textDe: true,
        },
      },
      photos: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  });

  return stories.map((story) => ({
    id: story.id,
    title: story.title,
    questionText: story.question?.textDe || 'Freie Geschichte',
    createdAt: story.createdAt,
    wordCount: story.wordCount,
    hasAudio: !!story.audioUrl,
    hasPhotos: story.photos.length > 0,
    status: story.status,
  }));
}

// ============================================
// Main Dashboard Data Function
// ============================================

/**
 * Get all dashboard data for a story author
 *
 * @param userId - The user's ID
 * @returns Dashboard data including subscription, question, progress, and stories
 */
export async function getDashboardData(userId: string): Promise<DashboardData> {
  // Get active subscription
  const subscription = await getActiveSubscription(userId);

  // If no active subscription, return empty state
  if (!subscription) {
    return {
      subscription: null,
      currentQuestion: null,
      progress: {
        answeredCount: 0,
        totalQuestions: 0,
        percentComplete: 0,
      },
      recentStories: [],
    };
  }

  // Fetch all data in parallel
  const [currentQuestion, progress, recentStories] = await Promise.all([
    getCurrentQuestion(subscription.id),
    getProgressStats(subscription.id),
    getRecentStories(userId, subscription.id),
  ]);

  return {
    subscription,
    currentQuestion,
    progress,
    recentStories,
  };
}
