/**
 * Magic Link Email Sender
 * Sends authentication emails via Mailgun
 * GDPR-compliant with audit logging
 */

import { render } from '@react-email/components';
import nodemailer from 'nodemailer';
import { MagicLinkEmail } from './templates/magic-link';

// ===========================================
// Types
// ===========================================

interface SendMagicLinkParams {
  email: string;
  magicLink: string;
}

interface SendMagicLinkResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// ===========================================
// Environment Validation
// ===========================================

function validateEmailConfig(): {
  apiKey: string;
  domain: string;
  fromEmail: string;
} {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const fromEmail =
    process.env.EMAIL_FROM || process.env.MAILGUN_FROM_EMAIL || 'ForeverStory <noreply@foreverstory.de>';

  if (!apiKey || !domain) {
    throw new Error(
      'Email configuration missing. Required: MAILGUN_API_KEY, MAILGUN_DOMAIN'
    );
  }

  return { apiKey, domain, fromEmail };
}

// ===========================================
// Mailgun Transporter
// ===========================================

function createMailgunTransporter(apiKey: string, domain: string) {
  // Mailgun SMTP configuration (EU region)
  return nodemailer.createTransport({
    host: 'smtp.eu.mailgun.org',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: `postmaster@${domain}`,
      pass: apiKey,
    },
  });
}

// ===========================================
// Main Send Function
// ===========================================

/**
 * Sends a magic link authentication email
 * @param params - Email address and magic link URL
 * @returns Result with success status and message ID
 */
export async function sendMagicLinkEmail(
  params: SendMagicLinkParams
): Promise<SendMagicLinkResult> {
  const { email, magicLink } = params;

  try {
    // Validate configuration
    const config = validateEmailConfig();

    // Skip email sending in development if flag is set
    if (process.env.SKIP_EMAIL_VERIFICATION === 'true' && process.env.NODE_ENV === 'development') {
      console.log('\n📧 [DEV MODE] Magic link email skipped');
      console.log(`   To: ${email}`);
      console.log(`   Link: ${magicLink}\n`);
      return {
        success: true,
        messageId: 'dev-mode-skip',
      };
    }

    // Render email template to HTML
    const emailHtml = await render(MagicLinkEmail({ magicLink }));

    // Create Mailgun transporter
    const transporter = createMailgunTransporter(config.apiKey, config.domain);

    // Send email
    const info = await transporter.sendMail({
      from: config.fromEmail,
      to: email,
      subject: 'Ihr Anmeldelink für ForeverStory',
      html: emailHtml,
      // Optional: Add plain text fallback
      text: generatePlainTextFallback(magicLink),
      // Headers for tracking and GDPR compliance
      headers: {
        'X-Email-Type': 'magic-link-auth',
        'X-Priority': '1', // High priority
      },
    });

    // Log success for GDPR audit trail
    console.log(`✅ Magic link sent to ${email} (ID: ${info.messageId})`);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    // Log error for monitoring
    console.error('❌ Failed to send magic link email:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ===========================================
// Plain Text Fallback
// ===========================================

/**
 * Generates plain text version for email clients that don't support HTML
 */
function generatePlainTextFallback(magicLink: string): string {
  return `
Guten Tag,

Sie haben einen Anmeldelink für Ihr ForeverStory-Konto angefordert.

Klicken Sie auf den folgenden Link, um sich anzumelden:

${magicLink}

Dieser Link ist 24 Stunden gültig.

Falls Sie diese E-Mail nicht angefordert haben, können Sie sie einfach ignorieren.

Mit freundlichen Grüßen,
Ihr ForeverStory-Team

---
Datenschutzerklärung: https://foreverstory.de/datenschutz
Impressum: https://foreverstory.de/impressum
  `.trim();
}

// ===========================================
// Development Helper
// ===========================================

/**
 * Test function for development - sends a test magic link email
 * Usage: node -e "require('./src/lib/email/send-magic-link').testSendEmail()"
 */
export async function testSendEmail() {
  const result = await sendMagicLinkEmail({
    email: 'test@example.com',
    magicLink: 'https://foreverstory.de/api/auth/callback/email?token=test123',
  });

  console.log('Test email result:', result);
  return result;
}
