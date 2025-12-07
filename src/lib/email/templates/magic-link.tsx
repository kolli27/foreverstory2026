/**
 * Magic Link Email Template
 * German language (formal "Sie")
 * Accessibility: Large touch targets, clear hierarchy, high contrast
 */

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface MagicLinkEmailProps {
  magicLink: string;
}

export function MagicLinkEmail({
  magicLink = 'https://foreverstory.de/api/auth/callback/email?token=abc123&email=test@example.com',
}: MagicLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Ihr Anmeldelink für ForeverStory</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo/Brand */}
          <Heading style={heading}>ForeverStory</Heading>

          {/* Main Content */}
          <Section style={section}>
            <Text style={greeting}>Guten Tag,</Text>

            <Text style={paragraph}>
              Sie haben einen Anmeldelink für Ihr ForeverStory-Konto angefordert.
            </Text>

            <Text style={paragraph}>
              Klicken Sie auf den folgenden Link, um sich anzumelden:
            </Text>

            {/* CTA Button - Large touch target for elderly users */}
            <Button
              href={magicLink}
              style={button}
            >
              Jetzt anmelden
            </Button>

            {/* Expiry notice */}
            <Text style={expiryNotice}>
              Dieser Link ist 24 Stunden gültig.
            </Text>

            {/* Security notice */}
            <Hr style={hr} />

            <Text style={footer}>
              Falls Sie diese E-Mail nicht angefordert haben, können Sie sie
              einfach ignorieren.
            </Text>

            <Text style={footer}>
              Mit freundlichen Grüßen,
              <br />
              Ihr ForeverStory-Team
            </Text>
          </Section>

          {/* Footer with links */}
          <Section style={footerSection}>
            <Text style={footerText}>
              <Link href="https://foreverstory.de/datenschutz" style={link}>
                Datenschutzerklärung
              </Link>
              {' • '}
              <Link href="https://foreverstory.de/impressum" style={link}>
                Impressum
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default MagicLinkEmail;

// ===========================================
// Styles
// ===========================================

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '40px auto',
  padding: '32px 24px',
  borderRadius: '8px',
  maxWidth: '600px',
};

const heading = {
  fontSize: '28px',
  fontWeight: '700',
  color: '#1a1a1a',
  marginBottom: '32px',
  textAlign: 'center' as const,
};

const section = {
  padding: '0',
};

const greeting = {
  fontSize: '18px',
  lineHeight: '28px',
  color: '#1a1a1a',
  marginBottom: '16px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#4a4a4a',
  marginBottom: '16px',
};

const button = {
  backgroundColor: '#0066cc',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '16px 24px',
  marginTop: '24px',
  marginBottom: '24px',
  // Minimum 44px touch target for accessibility
  minHeight: '44px',
};

const expiryNotice = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#666666',
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const hr = {
  borderColor: '#e0e0e0',
  margin: '32px 0',
};

const footer = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#666666',
  marginBottom: '12px',
};

const footerSection = {
  marginTop: '32px',
  paddingTop: '24px',
  borderTop: '1px solid #e0e0e0',
};

const footerText = {
  fontSize: '13px',
  lineHeight: '20px',
  color: '#999999',
  textAlign: 'center' as const,
};

const link = {
  color: '#0066cc',
  textDecoration: 'underline',
};
