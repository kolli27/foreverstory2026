/**
 * Zod Validation Schemas for ForeverStory
 * All error messages in German (Sie-form)
 */

import { z } from 'zod';

// ============================================
// Common Validators
// ============================================

export const emailSchema = z
  .string()
  .min(1, 'Bitte geben Sie Ihre E-Mail-Adresse ein.')
  .email('Bitte geben Sie eine gültige E-Mail-Adresse ein.');

export const passwordSchema = z
  .string()
  .min(8, 'Das Passwort muss mindestens 8 Zeichen lang sein.')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Das Passwort muss mindestens einen Großbuchstaben, einen Kleinbuchstaben und eine Zahl enthalten.'
  );

export const nameSchema = z
  .string()
  .min(1, 'Bitte geben Sie einen Namen ein.')
  .max(100, 'Der Name darf maximal 100 Zeichen lang sein.');

export const optionalNameSchema = z
  .string()
  .max(100, 'Der Name darf maximal 100 Zeichen lang sein.')
  .optional();

// ============================================
// Auth Schemas
// ============================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Bitte geben Sie Ihr Passwort ein.'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    firstName: optionalNameSchema,
    lastName: optionalNameSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Die Passwörter stimmen nicht überein.',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string(),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Die Passwörter stimmen nicht überein.',
    path: ['confirmPassword'],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// ============================================
// Story Schemas
// ============================================

export const storySchema = z.object({
  title: z
    .string()
    .max(200, 'Der Titel darf maximal 200 Zeichen lang sein.')
    .optional(),
  content: z
    .string()
    .min(1, 'Bitte schreiben Sie Ihre Geschichte.')
    .max(50000, 'Die Geschichte darf maximal 50.000 Zeichen lang sein.'),
  questionId: z.string().optional(),
});

export type StoryInput = z.infer<typeof storySchema>;

export const storyPhotoSchema = z.object({
  storyId: z.string(),
  caption: z.string().max(500, 'Die Bildunterschrift darf maximal 500 Zeichen lang sein.').optional(),
});

export type StoryPhotoInput = z.infer<typeof storyPhotoSchema>;

// ============================================
// Gift/Subscription Schemas
// ============================================

export const giftPurchaseSchema = z.object({
  recipientEmail: emailSchema,
  recipientName: nameSchema,
  plan: z.enum(['STARTER', 'STANDARD', 'PREMIUM'], {
    message: 'Bitte wählen Sie ein Paket aus.',
  }),
  giftMessage: z
    .string()
    .max(1000, 'Die Nachricht darf maximal 1.000 Zeichen lang sein.')
    .optional(),
  customQuestions: z
    .array(z.string().max(500, 'Jede Frage darf maximal 500 Zeichen lang sein.'))
    .max(5, 'Sie können maximal 5 eigene Fragen hinzufügen.')
    .optional(),
  deliveryDate: z.string().optional(), // ISO date string
  questionFrequency: z.enum(['weekly', 'biweekly']).default('weekly'),
  preferredDay: z.number().min(1).max(7).default(1),
});

export type GiftPurchaseInput = z.infer<typeof giftPurchaseSchema>;

// ============================================
// Book Order Schemas
// ============================================

export const shippingAddressSchema = z.object({
  name: nameSchema,
  street: z
    .string()
    .min(1, 'Bitte geben Sie Ihre Straße und Hausnummer ein.')
    .max(200, 'Die Adresse darf maximal 200 Zeichen lang sein.'),
  city: z
    .string()
    .min(1, 'Bitte geben Sie Ihre Stadt ein.')
    .max(100, 'Die Stadt darf maximal 100 Zeichen lang sein.'),
  postalCode: z
    .string()
    .min(1, 'Bitte geben Sie Ihre Postleitzahl ein.')
    .max(20, 'Die Postleitzahl darf maximal 20 Zeichen lang sein.'),
  country: z
    .string()
    .length(2, 'Bitte wählen Sie ein Land aus.')
    .default('DE'),
  phone: z
    .string()
    .max(30, 'Die Telefonnummer darf maximal 30 Zeichen lang sein.')
    .optional(),
});

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;

export const bookOrderSchema = z.object({
  bookId: z.string(),
  format: z.enum(['HARDCOVER_STANDARD', 'HARDCOVER_PREMIUM', 'SOFTCOVER'], {
    message: 'Bitte wählen Sie ein Buchformat aus.',
  }),
  quantity: z
    .number()
    .min(1, 'Mindestens 1 Exemplar erforderlich.')
    .max(10, 'Maximal 10 Exemplare pro Bestellung.'),
  shippingAddress: shippingAddressSchema,
});

export type BookOrderInput = z.infer<typeof bookOrderSchema>;

// ============================================
// Family Member Schemas
// ============================================

export const inviteFamilyMemberSchema = z.object({
  email: emailSchema,
  name: optionalNameSchema,
  role: z.enum(['EDITOR', 'READER'], {
    message: 'Bitte wählen Sie eine Berechtigung aus.',
  }),
});

export type InviteFamilyMemberInput = z.infer<typeof inviteFamilyMemberSchema>;

// ============================================
// Profile Schemas
// ============================================

export const updateProfileSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  email: emailSchema.optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Bitte geben Sie Ihr aktuelles Passwort ein.'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Die Passwörter stimmen nicht überein.',
    path: ['confirmPassword'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// ============================================
// Question Schemas
// ============================================

export const customQuestionSchema = z.object({
  textDe: z
    .string()
    .min(10, 'Die Frage muss mindestens 10 Zeichen lang sein.')
    .max(500, 'Die Frage darf maximal 500 Zeichen lang sein.'),
  category: z.enum([
    'CHILDHOOD',
    'EDUCATION',
    'CAREER',
    'FAMILY',
    'RELATIONSHIPS',
    'WAR_POSTWAR',
    'DDR',
    'REUNIFICATION',
    'TRADITIONS',
    'LIFE_LESSONS',
    'CUSTOM',
  ]).default('CUSTOM'),
});

export type CustomQuestionInput = z.infer<typeof customQuestionSchema>;

// ============================================
// Contact/Support Schemas
// ============================================

export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z
    .string()
    .min(1, 'Bitte geben Sie einen Betreff ein.')
    .max(200, 'Der Betreff darf maximal 200 Zeichen lang sein.'),
  message: z
    .string()
    .min(10, 'Die Nachricht muss mindestens 10 Zeichen lang sein.')
    .max(5000, 'Die Nachricht darf maximal 5.000 Zeichen lang sein.'),
});

export type ContactInput = z.infer<typeof contactSchema>;

// ============================================
// Consent Schemas
// ============================================

export const consentSchema = z.object({
  terms: z.literal(true, {
    message: 'Sie müssen den AGB zustimmen.',
  }),
  privacy: z.literal(true, {
    message: 'Sie müssen der Datenschutzerklärung zustimmen.',
  }),
  marketing: z.boolean().optional(),
});

export type ConsentInput = z.infer<typeof consentSchema>;
