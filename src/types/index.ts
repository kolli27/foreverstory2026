// ============================================
// Core Types for ForeverStory
// ============================================

// Note: Prisma types will be available after running `npm run db:generate`
// Re-export them here once generated:
// export type { User, Session, Subscription, Question, Story, Book } from '@prisma/client';

// ============================================
// Enums (mirroring Prisma for client-side use)
// ============================================

export const UserRole = {
  GIFT_GIVER: 'GIFT_GIVER',
  STORY_AUTHOR: 'STORY_AUTHOR',
  READER: 'READER',
  ADMIN: 'ADMIN',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const SubscriptionPlan = {
  STARTER: 'STARTER',
  STANDARD: 'STANDARD',
  PREMIUM: 'PREMIUM',
} as const;
export type SubscriptionPlan = (typeof SubscriptionPlan)[keyof typeof SubscriptionPlan];

export const SubscriptionStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;
export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

export const QuestionCategory = {
  CHILDHOOD: 'CHILDHOOD',
  EDUCATION: 'EDUCATION',
  CAREER: 'CAREER',
  FAMILY: 'FAMILY',
  RELATIONSHIPS: 'RELATIONSHIPS',
  WAR_POSTWAR: 'WAR_POSTWAR',
  DDR: 'DDR',
  REUNIFICATION: 'REUNIFICATION',
  TRADITIONS: 'TRADITIONS',
  LIFE_LESSONS: 'LIFE_LESSONS',
  CUSTOM: 'CUSTOM',
} as const;
export type QuestionCategory = (typeof QuestionCategory)[keyof typeof QuestionCategory];

export const StoryStatus = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  EDITED: 'EDITED',
  APPROVED: 'APPROVED',
} as const;
export type StoryStatus = (typeof StoryStatus)[keyof typeof StoryStatus];

export const BookStatus = {
  DRAFT: 'DRAFT',
  PREVIEW_READY: 'PREVIEW_READY',
  ORDERED: 'ORDERED',
  PRINTING: 'PRINTING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;
export type BookStatus = (typeof BookStatus)[keyof typeof BookStatus];

// ============================================
// API Types
// ============================================

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// User & Auth Types
// ============================================

export interface AuthUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  locale: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  locale?: string;
}

// ============================================
// Subscription & Gift Types
// ============================================

export interface GiftPurchaseData {
  // Recipient
  recipientEmail: string;
  recipientName?: string;
  
  // Plan
  plan: SubscriptionPlan;
  
  // Customization
  giftMessage?: string;
  customQuestions?: string[];
  
  // Scheduling
  deliveryDate?: Date; // When to send the gift email
  questionFrequency?: 'weekly' | 'biweekly';
  preferredDay?: number; // 1-7
}

export interface SubscriptionWithDetails {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date | null;
  endDate: Date | null;
  storiesCount: number;
  questionsAnswered: number;
  questionsTotal: number;
  bookStatus: BookStatus | null;
}

// ============================================
// Story Types
// ============================================

export interface StoryInput {
  questionId?: string;
  title?: string;
  content: string;
}

export interface StoryWithQuestion {
  id: string;
  title: string | null;
  content: string;
  status: StoryStatus;
  wordCount: number;
  createdAt: Date;
  updatedAt: Date;
  question: {
    id: string;
    textDe: string;
    category: QuestionCategory;
  } | null;
  photos: {
    id: string;
    url: string;
    thumbnailUrl: string | null;
    caption: string | null;
  }[];
}

export interface VoiceRecordingResult {
  audioUrl: string;
  duration: number;
  transcription: string;
}

// ============================================
// Question Types
// ============================================

export interface CurrentQuestion {
  id: string;
  textDe: string;
  textEn: string | null;
  category: QuestionCategory;
  deliveryId: string;
  deliveredAt: Date;
  dueDate: Date; // When next question will be sent
  canSkip: boolean;
}

export interface QuestionHistory {
  id: string;
  textDe: string;
  category: QuestionCategory;
  deliveredAt: Date;
  status: 'answered' | 'skipped' | 'pending';
  storyId?: string;
}

// ============================================
// Book Types
// ============================================

export interface BookPreview {
  id: string;
  title: string;
  pageCount: number;
  previewPdfUrl: string;
  stories: {
    id: string;
    title: string | null;
    wordCount: number;
  }[];
}

export interface BookOrder {
  bookId: string;
  format: 'HARDCOVER_STANDARD' | 'HARDCOVER_PREMIUM' | 'SOFTCOVER';
  quantity: number;
  shippingAddress: ShippingAddress;
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string; // ISO 3166-1 alpha-2
  phone?: string;
}

// ============================================
// Family Types
// ============================================

export interface FamilyMemberInput {
  email: string;
  name?: string;
  role: 'EDITOR' | 'READER';
}

export interface FamilyMemberWithStatus {
  id: string;
  email: string;
  name: string | null;
  role: 'OWNER' | 'EDITOR' | 'READER';
  status: 'pending' | 'accepted';
  invitedAt: Date;
  acceptedAt: Date | null;
}

// ============================================
// Pricing Types
// ============================================

export interface PricingPlan {
  id: SubscriptionPlan;
  name: string;
  description: string;
  durationMonths: number;
  priceEuroCents: number;
  features: string[];
  includesBook: boolean;
  bookFormat?: 'HARDCOVER_STANDARD' | 'HARDCOVER_PREMIUM';
  popular?: boolean;
}

export interface PricingConfig {
  plans: PricingPlan[];
  additionalBooks: {
    hardcoverStandard: number;
    hardcoverPremium: number;
    softcover: number;
  };
  shipping: {
    germany: number;
    austria: number;
    switzerland: number;
    eu: number;
  };
}

// ============================================
// Form Types (for React Hook Form)
// ============================================

export interface StoryFormData {
  title: string;
  content: string;
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface GiftFormData {
  recipientEmail: string;
  recipientName: string;
  plan: SubscriptionPlan;
  giftMessage: string;
  customQuestions: string[];
  deliveryDate: string;
}
