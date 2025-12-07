# Authentication Testing Checklist

Manual testing guide for the NextAuth.js v5 magic link authentication system.

## Prerequisites

Before testing, ensure you have:

- [ ] PostgreSQL database running
- [ ] Database URL configured in `.env`
- [ ] Mailgun account with API key and domain configured
- [ ] Run `npm run db:generate` to generate Prisma client
- [ ] Run `npm run db:push` to sync database schema
- [ ] Start dev server with `npm run dev`

## Environment Setup

Create `.env.local` with the following variables:

```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/foreverstory"

# NextAuth
NEXTAUTH_SECRET="your-secret-from-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Email (Mailgun)
MAILGUN_API_KEY="your-mailgun-api-key"
MAILGUN_DOMAIN="your-mailgun-domain"
EMAIL_FROM="ForeverStory <noreply@foreverstory.de>"

# Optional: Skip email in development
SKIP_EMAIL_VERIFICATION="true"
```

---

## Test Suite

### 1. Login Flow (Happy Path)

**Test: Request magic link**

- [ ] Navigate to http://localhost:3000/login
- [ ] Verify page displays:
  - [x] "Anmelden" heading
  - [x] Email input field with label "E-Mail-Adresse"
  - [x] "Anmeldelink senden" button
  - [x] Privacy policy link
- [ ] Enter valid email address
- [ ] Click "Anmeldelink senden"
- [ ] Verify redirect to `/verify-request` page
- [ ] Check email inbox (or dev console if `SKIP_EMAIL_VERIFICATION=true`)
- [ ] Verify email contains:
  - [x] German subject: "Ihr Anmeldelink für ForeverStory"
  - [x] Formal "Sie" greeting
  - [x] "Jetzt anmelden" button
  - [x] 24-hour expiry notice
  - [x] Footer with Datenschutzerklärung and Impressum links

**Test: Click magic link**

- [ ] Click "Jetzt anmelden" button in email
- [ ] Verify redirect to callback URL (default: `/`)
- [ ] Check browser cookies for `next-auth.session-token`
- [ ] Verify user is logged in

**Test: Session persistence**

- [ ] Refresh the page
- [ ] Verify user remains logged in
- [ ] Navigate to different pages
- [ ] Verify session persists

---

### 2. Email Validation

**Test: Empty email**

- [ ] Navigate to `/login`
- [ ] Leave email field empty
- [ ] Click submit
- [ ] Verify error: "Bitte geben Sie Ihre E-Mail-Adresse ein."

**Test: Invalid email format**

- [ ] Enter `notanemail`
- [ ] Click submit
- [ ] Verify error: "Bitte geben Sie eine gültige E-Mail-Adresse ein."

**Test: Email normalization**

- [ ] Enter `  Test@EXAMPLE.com  ` (with spaces and caps)
- [ ] Submit form
- [ ] Verify email is normalized to `test@example.com`

---

### 3. Verify Request Page

**Test: Page display**

- [ ] Navigate to `/verify-request?email=test@example.com`
- [ ] Verify page shows:
  - [x] Success icon (green envelope)
  - [x] "E-Mail gesendet!" heading
  - [x] Email address displayed
  - [x] Instructions in German
  - [x] Troubleshooting tips
  - [x] "Link erneut senden" button (disabled for 60 seconds)

**Test: Resend link**

- [ ] Wait 60 seconds on verify-request page
- [ ] Click "Link erneut senden"
- [ ] Verify button shows loading state
- [ ] Verify success message: "✓ E-Mail wurde erneut gesendet!"
- [ ] Check inbox for second email
- [ ] Verify resend button is disabled again for 60 seconds

---

### 4. Error Handling

**Test: Expired magic link**

- [ ] Wait 24+ hours after requesting magic link (or manually expire token in DB)
- [ ] Click magic link
- [ ] Verify redirect to `/error` page
- [ ] Verify error message in German
- [ ] Verify "Zurück zur Anmeldung" button works

**Test: Invalid magic link**

- [ ] Manually construct invalid magic link URL
- [ ] Navigate to it
- [ ] Verify redirect to `/error` page with appropriate message

**Test: Network error during email send**

- [ ] Set invalid `MAILGUN_API_KEY` in `.env.local`
- [ ] Try to request magic link
- [ ] Verify error message: "Die E-Mail konnte nicht gesendet werden..."
- [ ] Restore valid API key

---

### 5. Route Protection (Middleware)

**Test: Protected routes (unauthenticated)**

- [ ] Ensure you're logged out
- [ ] Try to access `/dashboard`
- [ ] Verify redirect to `/login?callbackUrl=/dashboard`
- [ ] Log in
- [ ] Verify redirect back to `/dashboard`

**Test: Auth routes (authenticated)**

- [ ] Log in first
- [ ] Navigate to `/login`
- [ ] Verify redirect to `/dashboard` (or last callbackUrl)

**Test: Admin routes**

- [ ] Create test user with role `ADMIN` in database
- [ ] Log in as admin
- [ ] Navigate to `/admin`
- [ ] Verify access granted
- [ ] Log out, log in as regular user (role `GIFT_GIVER`)
- [ ] Try to access `/admin`
- [ ] Verify redirect to `/unauthorized`

---

### 6. Session Helpers (Server-Side)

**Test: `requireAuth()` helper**

Create a test page:

```tsx
// src/app/test-auth/page.tsx
import { requireAuth } from '@/lib/auth/get-session';

export default async function TestAuthPage() {
  const user = await requireAuth();
  return <div>Welcome {user.email}</div>;
}
```

- [ ] Access `/test-auth` while logged out
- [ ] Verify redirect to `/login?callbackUrl=/test-auth`
- [ ] Log in
- [ ] Verify redirect back and page displays user email

**Test: `requireRole()` helper**

Create a test page:

```tsx
// src/app/test-role/page.tsx
import { requireRole } from '@/lib/auth/get-session';

export default async function TestRolePage() {
  const user = await requireRole(['STORY_AUTHOR', 'ADMIN']);
  return <div>Authorized: {user.role}</div>;
}
```

- [ ] Log in as user with role `GIFT_GIVER`
- [ ] Access `/test-role`
- [ ] Verify redirect to `/unauthorized`
- [ ] Change user role to `STORY_AUTHOR` in database
- [ ] Refresh page
- [ ] Verify access granted and role displayed

---

### 7. Session Provider (Client-Side)

**Test: `useSession` hook**

Create a test component:

```tsx
// src/app/test-session/page.tsx
'use client';

import { useSession } from '@/lib/auth/session-context';

export default function TestSessionPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Lädt...</div>;
  if (status === 'unauthenticated') return <div>Nicht angemeldet</div>;

  return <div>Hallo, {session?.user?.email}</div>;
}
```

- [ ] Access `/test-session` while logged out
- [ ] Verify shows "Nicht angemeldet"
- [ ] Log in
- [ ] Verify shows "Hallo, [your-email]"
- [ ] Open DevTools and throttle network to "Slow 3G"
- [ ] Refresh page
- [ ] Verify shows "Lädt..." briefly before session loads

---

### 8. Accessibility Testing

**Test: Keyboard navigation**

- [ ] Navigate to `/login` using only keyboard (Tab key)
- [ ] Verify all interactive elements are reachable
- [ ] Verify focus indicators are visible
- [ ] Submit form using Enter key
- [ ] Verify form submission works

**Test: Screen reader**

- [ ] Enable screen reader (VoiceOver on Mac, NVDA on Windows)
- [ ] Navigate login form
- [ ] Verify all labels are announced
- [ ] Verify error messages are announced when shown
- [ ] Verify ARIA live regions work for dynamic updates

**Test: Touch targets (mobile)**

- [ ] Open `/login` on mobile device or responsive mode
- [ ] Verify all buttons are at least 44x44px
- [ ] Verify easy to tap without accidentally hitting other elements
- [ ] Verify font size is at least 16px (prevents iOS zoom)

---

### 9. GDPR Compliance

**Test: Audit logging**

- [ ] Check server console logs
- [ ] Verify login events are logged: `✅ User signed in: [email]`
- [ ] Verify new user creation logged: `👤 New user created: [email]`
- [ ] Verify sign-out logged: `👋 User signed out`

**Test: Privacy links**

- [ ] Verify `/login` page has Datenschutzerklärung link
- [ ] Verify `/login` page has Impressum link
- [ ] Verify email footer has both links

**Test: Data storage**

- [ ] Check Mailgun settings - verify EU region (smtp.eu.mailgun.org)
- [ ] Verify database is hosted in EU
- [ ] Verify no data is sent to US servers

---

### 10. Database Validation

**Test: User creation**

- [ ] Request magic link for new email
- [ ] Check database:
  ```sql
  SELECT id, email, "emailVerified", role, locale FROM "User" WHERE email = 'test@example.com';
  ```
- [ ] Verify user created with:
  - [x] Unique ID (cuid)
  - [x] Email (lowercase, trimmed)
  - [x] `emailVerified` is NULL (before first login)
  - [x] Default role: `GIFT_GIVER`
  - [x] Default locale: `de`

**Test: Session storage**

- [ ] Complete magic link login
- [ ] Check database:
  ```sql
  SELECT token, "userId", "expiresAt" FROM "Session" WHERE "userId" = 'user-id';
  ```
- [ ] Verify session created with:
  - [x] Unique token
  - [x] Correct userId
  - [x] expiresAt = now() + 30 days

**Test: Email verification**

- [ ] Complete magic link login
- [ ] Check database:
  ```sql
  SELECT "emailVerified" FROM "User" WHERE email = 'test@example.com';
  ```
- [ ] Verify `emailVerified` is set to current timestamp

---

### 11. Production Build

**Test: Build and start**

- [ ] Run `npm run build`
- [ ] Verify build completes without errors
- [ ] Run `npm run start`
- [ ] Test login flow in production mode
- [ ] Verify cookies are set with `secure: true`
- [ ] Verify no console errors

---

## Test Results

| Test Category | Status | Notes |
|---------------|--------|-------|
| Login Flow | ⬜ | |
| Email Validation | ⬜ | |
| Verify Request | ⬜ | |
| Error Handling | ⬜ | |
| Route Protection | ⬜ | |
| Session Helpers | ⬜ | |
| Session Provider | ⬜ | |
| Accessibility | ⬜ | |
| GDPR Compliance | ⬜ | |
| Database Validation | ⬜ | |
| Production Build | ✅ | Verified during implementation |

---

## Common Issues & Troubleshooting

### Email not received

- Check Mailgun dashboard for delivery status
- Check spam folder
- Verify `EMAIL_FROM` domain is verified in Mailgun
- Check server logs for email send errors
- Try with `SKIP_EMAIL_VERIFICATION=true` to test flow without email

### Session not persisting

- Clear browser cookies and try again
- Check `NEXTAUTH_SECRET` is set
- Verify database connection is working
- Check session expiry in database

### Build errors

- Run `npm run db:generate` to regenerate Prisma client
- Clear `.next` folder: `rm -rf .next`
- Verify all environment variables are set

### Database connection errors

- Verify PostgreSQL is running
- Check `DATABASE_URL` format is correct
- Test connection: `psql $DATABASE_URL`

---

## Next Steps After Testing

Once all tests pass:

1. [ ] Document any bugs found and create issues
2. [ ] Update environment variable documentation
3. [ ] Create deployment guide
4. [ ] Set up staging environment for user testing
5. [ ] Plan Phase 8: Automated Testing (Jest, Playwright)
6. [ ] Plan Phase 9: Documentation

---

**Last Updated:** December 2024
