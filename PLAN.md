# Authentication Implementation Plan
## NextAuth.js v5 (Auth.js) - Magic Link Only

**Target:** German-market elderly users (65+)
**Auth Method:** Email magic links (passwordless)
**Locale:** German (formal "Sie")
**Framework:** Next.js 14 App Router

---

## 1. Files to Create/Modify

### New Files to Create

#### Authentication Core
```
src/auth.ts                           # NextAuth.js config & setup
src/auth.config.ts                    # Auth configuration (edge-compatible)
src/middleware.ts                     # Route protection middleware
```

#### Prisma Adapter
```
src/lib/auth/prisma-adapter.ts        # Custom adapter for existing schema
```

#### API Routes (App Router)
```
src/app/api/auth/[...nextauth]/route.ts   # NextAuth.js API handler
```

#### Email Templates
```
src/lib/email/templates/magic-link.tsx    # React Email component
src/lib/email/send-magic-link.ts          # Email sending logic
```

#### Auth UI Components
```
src/components/auth/login-form.tsx        # Magic link request form
src/components/auth/auth-error.tsx        # Error display component
src/components/auth/verify-request.tsx    # "Check your email" page
```

#### App Routes
```
src/app/(auth)/login/page.tsx             # Login page
src/app/(auth)/verify-request/page.tsx    # Email sent confirmation
src/app/(auth)/error/page.tsx             # Auth error page
src/app/(auth)/layout.tsx                 # Auth pages layout
```

#### Utilities
```
src/lib/auth/get-session.ts               # Server-side session helper
src/lib/auth/session-context.tsx          # Client-side session provider
src/types/auth.ts                         # Auth-related TypeScript types
```

### Files to Modify

```
package.json                              # Add NextAuth.js dependencies
.env.example                              # Document required env vars
prisma/schema.prisma                      # Add indexes if needed
src/app/layout.tsx                        # Add SessionProvider
```

---

## 2. Environment Variables Needed

Add to `.env`:

```bash
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=                          # Generate with: openssl rand -base64 32

# Email Provider (Mailgun - already in use)
MAILGUN_API_KEY=                          # Existing variable
MAILGUN_DOMAIN=                           # Existing variable
EMAIL_FROM="ForeverStory <noreply@foreverstory.de>"

# Optional: Email server (if not using Mailgun)
# EMAIL_SERVER=smtp://username:password@smtp.mailgun.org:587

# Database (already configured)
DATABASE_URL=                             # Existing variable
```

Add to `.env.example`:

```bash
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here-generate-with-openssl

# Email
EMAIL_FROM="ForeverStory <noreply@foreverstory.de>"
MAILGUN_API_KEY=your-mailgun-key
MAILGUN_DOMAIN=your-mailgun-domain
```

---

## 3. Database Changes

### Option A: Use Existing Schema (RECOMMENDED)

**No schema changes needed.** The existing `User` and `Session` models are sufficient:

```prisma
// Existing models already support NextAuth.js
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?  // ✅ Used by NextAuth
  passwordHash  String?    // ✅ Nullable (unused for magic link)
  // ... rest of fields
  sessions      Session[]  // ✅ Relation exists
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique  // ✅ Will store session token
  expiresAt DateTime             // ✅ Required by NextAuth
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**Custom Prisma adapter required** to map NextAuth's expected fields to our schema.

### Option B: Add Indexes (Optional Performance Optimization)

```prisma
model User {
  // ... existing fields

  @@index([email])           // Speed up login lookups
}

model Session {
  // ... existing fields

  @@index([userId])          // Speed up session queries
  @@index([expiresAt])       // Speed up cleanup queries
}
```

**Migration command (if adding indexes):**
```bash
npm run db:generate
npm run db:migrate -- --name add_auth_indexes
```

---

## 4. Implementation Order

### Phase 1: Dependencies & Configuration (30 min)
**Goal:** Install packages and set up environment

1. **Install dependencies**
   ```bash
   npm install next-auth@beta @auth/prisma-adapter
   npm install nodemailer react-email @react-email/components
   npm install -D @types/nodemailer
   ```

2. **Generate NEXTAUTH_SECRET**
   ```bash
   openssl rand -base64 32
   ```

3. **Update .env and .env.example** with required variables

4. **Create TypeScript types** (`src/types/auth.ts`)

---

### Phase 2: Prisma Adapter (45 min)
**Goal:** Connect NextAuth to existing database schema

5. **Create custom Prisma adapter** (`src/lib/auth/prisma-adapter.ts`)
   - Map NextAuth's `sessionToken` → `Session.token`
   - Map NextAuth's `expires` → `Session.expiresAt`
   - Handle User creation/update
   - Handle Session CRUD operations

6. **Test adapter** with Prisma Studio to verify data structure

---

### Phase 3: Email Infrastructure (1 hour)
**Goal:** German email templates for magic links

7. **Create email template** (`src/lib/email/templates/magic-link.tsx`)
   - React Email component
   - German copy (formal "Sie")
   - Large, accessible button (min 44px)
   - Clear expiry notice (24 hours)
   - Branded with ForeverStory design

8. **Create email sender** (`src/lib/email/send-magic-link.ts`)
   - Mailgun integration
   - Fallback error handling
   - Logging for GDPR audit trail

9. **Test email sending** (send test to your email)

---

### Phase 4: NextAuth Configuration (1 hour)
**Goal:** Core auth setup

10. **Create auth config** (`src/auth.config.ts`)
    - Email provider configuration
    - Custom magic link email content
    - Session strategy (JWT vs database)
    - Callbacks for role handling

11. **Create auth instance** (`src/auth.ts`)
    - Import adapter
    - Configure providers
    - Set up callbacks (jwt, session)

12. **Create API route** (`src/app/api/auth/[...nextauth]/route.ts`)
    - Export GET and POST handlers

---

### Phase 5: UI Components (1.5 hours)
**Goal:** Elderly-friendly German UI

13. **Create login form** (`src/components/auth/login-form.tsx`)
    - Email input (large, clear)
    - German labels and validation
    - Loading states
    - Accessibility (ARIA labels)
    - Error handling

14. **Create verify request page** (`src/components/auth/verify-request.tsx`)
    - "Check your email" message in German
    - Clear instructions
    - Resend link option
    - Large, readable text (min 16px)

15. **Create error component** (`src/components/auth/auth-error.tsx`)
    - Map NextAuth errors to German messages
    - User-friendly explanations

---

### Phase 6: App Routes (45 min)
**Goal:** Auth pages in App Router

16. **Create auth layout** (`src/app/(auth)/layout.tsx`)
    - Centered, simple design
    - ForeverStory branding
    - High contrast mode support

17. **Create login page** (`src/app/(auth)/login/page.tsx`)
    - Render login form
    - Handle redirects
    - SEO metadata in German

18. **Create verify page** (`src/app/(auth)/verify-request/page.tsx`)
    - Show after email sent
    - Instructions in German

19. **Create error page** (`src/app/(auth)/error/page.tsx`)
    - Display auth errors
    - Recovery options

---

### Phase 7: Session Management (1 hour)
**Goal:** Session helpers and protection

20. **Create session helpers** (`src/lib/auth/get-session.ts`)
    - Server-side: `getServerSession()`
    - Role checks: `requireAuth()`, `requireRole()`

21. **Create session provider** (`src/lib/auth/session-context.tsx`)
    - Client-side SessionProvider wrapper
    - TypeScript types for user/session

22. **Update root layout** (`src/app/layout.tsx`)
    - Wrap app in SessionProvider
    - Pass session from server to client

23. **Create middleware** (`src/middleware.ts`)
    - Protect routes by role
    - Redirect unauthenticated users
    - Handle multi-role access

---

### Phase 8: Testing & Validation (1 hour)
**Goal:** Ensure everything works

24. **Manual testing checklist:**
    - [ ] Request magic link (email sent)
    - [ ] Click magic link (logged in)
    - [ ] Session persists across pages
    - [ ] Logout works
    - [ ] Expired link shows error
    - [ ] Invalid email shows validation
    - [ ] Protected routes redirect
    - [ ] Email template renders correctly
    - [ ] German translations are correct
    - [ ] Mobile responsive (touch targets 44px+)
    - [ ] High contrast mode works

25. **Database verification:**
    - [ ] User created with correct fields
    - [ ] Session stored with token
    - [ ] emailVerified set after login
    - [ ] Old sessions cleaned up

26. **GDPR compliance check:**
    - [ ] Consent banner shown
    - [ ] Privacy policy linked
    - [ ] Impressum accessible
    - [ ] Session data in EU region only

---

### Phase 9: Documentation (30 min)
**Goal:** Developer handoff

27. **Update README.md** with:
    - Auth setup instructions
    - Environment variables
    - Testing magic link locally

28. **Create auth documentation** (`docs/authentication.md`)
    - Architecture overview
    - Session flow diagram
    - Troubleshooting guide

---

## 5. German Copy Reference

### Email Subject
```
Ihr Anmeldelink für ForeverStory
```

### Email Body (Key Phrases)
```
Guten Tag,

Sie haben einen Anmeldelink für Ihr ForeverStory-Konto angefordert.

Klicken Sie auf den folgenden Link, um sich anzumelden:

[Jetzt anmelden]

Dieser Link ist 24 Stunden gültig.

Falls Sie diese E-Mail nicht angefordert haben, können Sie sie einfach ignorieren.

Mit freundlichen Grüßen,
Ihr ForeverStory-Team
```

### UI Messages
```
Login page heading: "Anmelden"
Email input label: "E-Mail-Adresse"
Submit button: "Anmeldelink senden"
Verify page: "E-Mail gesendet! Bitte prüfen Sie Ihr Postfach."
Error messages:
  - "Bitte geben Sie eine gültige E-Mail-Adresse ein."
  - "Der Link ist abgelaufen. Bitte fordern Sie einen neuen an."
  - "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut."
```

---

## 6. Dependencies Summary

```json
{
  "dependencies": {
    "next-auth": "^5.0.0-beta.25",
    "@auth/prisma-adapter": "^2.7.4",
    "nodemailer": "^6.9.15",
    "react-email": "^3.0.1",
    "@react-email/components": "^0.0.25"
  },
  "devDependencies": {
    "@types/nodemailer": "^6.4.16"
  }
}
```

---

## 7. Success Criteria

**Authentication is complete when:**
- [ ] User can request magic link via email
- [ ] Email arrives in German with accessible design
- [ ] Clicking link logs user in and creates session
- [ ] Session persists for 30 days
- [ ] User role (GIFT_GIVER, STORY_AUTHOR, etc.) is accessible
- [ ] Protected routes redirect to login
- [ ] Logout clears session
- [ ] All text is in German (formal "Sie")
- [ ] UI meets accessibility standards (font size, contrast, touch targets)
- [ ] GDPR audit log captures login events

---

## 8. Known Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Email delivery issues (spam folder) | Add SPF/DKIM records, use reputable sender |
| User doesn't receive email | Show "resend link" option after 1 minute |
| Link expires too quickly | Set 24-hour expiry, show clear error message |
| Elderly users confused by magic link | Add clear instructions, phone support number |
| Session hijacking | HTTP-only cookies, CSRF tokens, short-lived sessions |

---

## 9. Post-Implementation Tasks (Future)

**Not in this phase, but planned:**
- [ ] Add password fallback authentication
- [ ] Implement Google OAuth (optional)
- [ ] Add 2FA for admin accounts
- [ ] Email verification reminder cron job
- [ ] Session activity monitoring
- [ ] "Remember this device" feature
- [ ] Account recovery flow

---

## 10. Testing Strategy

### Local Development
```bash
# Use MailHog or Mailpit for local email testing
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog

# Update .env for local SMTP
EMAIL_SERVER=smtp://localhost:1025
```

### Staging Environment
- Test with real Mailgun account
- Verify email delivery to Gmail, Outlook, GMX (popular in Germany)
- Test on mobile devices (iOS Safari, Android Chrome)

### Production Checklist
- [ ] NEXTAUTH_URL set to production domain
- [ ] NEXTAUTH_SECRET is strong and unique
- [ ] Email domain verified in Mailgun
- [ ] SSL certificate valid (required for secure cookies)
- [ ] Cookies set with `secure: true` in production

---

**Estimated Total Implementation Time:** 6-8 hours

**Next Steps After Approval:**
1. Run Phase 1 (dependencies)
2. Implement custom Prisma adapter
3. Set up email infrastructure
4. Build UI components
5. Test end-to-end flow

---

*Ready for review and approval.*
