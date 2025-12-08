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

# Story Submission Testing Checklist

Manual testing guide for the complete story submission flow including text input, voice recording, transcription, and photo upload.

## Test Page Access

Use the dedicated test page for manual testing:
- Navigate to: `http://localhost:3000/test/story-flow`
- This page bypasses authentication for development testing
- No data is saved to the database (test mode only)

---

## Test Suite

### 1. Text Input (Happy Path)

**Test: Basic text entry**

- [ ] Navigate to `/test/story-flow`
- [ ] Select "Text eingeben" mode (default)
- [ ] Verify editor displays with:
  - [x] Large text area (minimum 44px touch targets)
  - [x] Character counter starting at "0 / 10.000"
  - [x] "Entwurf speichern" button
  - [x] "Absenden" button (disabled initially)
- [ ] Type sample text
- [ ] Verify character counter updates in real-time
- [ ] Verify "Absenden" button enables when content exists

**Test: Character limit enforcement**

- [ ] Paste text longer than 10,000 characters
- [ ] Verify text is truncated at 10,000 characters
- [ ] Verify character counter shows "10.000 / 10.000"
- [ ] Verify warning message appears in red
- [ ] Type additional characters
- [ ] Verify no characters beyond 10,000 are accepted

**Test: Draft auto-save**

- [ ] Type sample text
- [ ] Wait 2 seconds without typing
- [ ] Verify "Entwurf gespeichert" message appears
- [ ] Refresh the page (CMD+R / CTRL+R)
- [ ] Verify text persists in editor
- [ ] Verify character count is correct

**Test: Draft manual save**

- [ ] Type sample text
- [ ] Click "Entwurf speichern" button
- [ ] Verify button shows loading state briefly
- [ ] Verify success message: "Entwurf gespeichert"
- [ ] Verify ARIA live region announces save status

**Test: Story submission**

- [ ] Enter valid text (at least 50 characters recommended)
- [ ] Click "Absenden" button
- [ ] Verify submission success (test page shows alert)
- [ ] Verify story appears in "Eingereichte Geschichten" list
- [ ] Verify story shows correct character count

---

### 2. Voice Recording

**Test: Start recording**

- [ ] Navigate to `/test/story-flow`
- [ ] Select "Sprechen" mode
- [ ] Verify microphone permission prompt appears
- [ ] Grant microphone permission
- [ ] Verify recording UI displays:
  - [x] Large "Aufnahme starten" button (red, 44px+ touch target)
  - [x] Waveform visualization area
  - [x] Timer display (00:00)
  - [x] "Stattdessen Text eingeben" link
- [ ] Click "Aufnahme starten"
- [ ] Verify button changes to "Aufnahme beenden"
- [ ] Speak into microphone
- [ ] Verify waveform animates with audio input
- [ ] Verify timer increments

**Test: Stop recording**

- [ ] While recording, click "Aufnahme beenden"
- [ ] Verify recording stops
- [ ] Verify transition to transcription loading state
- [ ] Verify loading animation displays
- [ ] Verify ARIA live region announces "Ihre Aufnahme wird transkribiert..."

**Test: Microphone permission denied**

- [ ] Revoke microphone permission in browser settings
- [ ] Select "Sprechen" mode
- [ ] Attempt to start recording
- [ ] Verify error message in German
- [ ] Verify fallback option to switch to text input

**Test: Switch to text input**

- [ ] Start on "Sprechen" mode
- [ ] Click "Stattdessen Text eingeben" link
- [ ] Verify immediate switch to text editor
- [ ] Verify no recording data is lost

---

### 3. Transcription

**Test: Successful transcription**

- [ ] Record 10-15 seconds of clear German speech
- [ ] Stop recording
- [ ] Wait for transcription (typically 5-15 seconds)
- [ ] Verify transcription editor displays:
  - [x] Transcribed German text
  - [x] Editable text area
  - [x] Character counter
  - [x] "Erneut aufnehmen" button
  - [x] "Absenden" button
- [ ] Verify transcribed text is reasonably accurate
- [ ] Verify ARIA live region announces completion

**Test: Edit transcription**

- [ ] Complete a transcription
- [ ] Edit the transcribed text
- [ ] Add corrections or additional content
- [ ] Verify character counter updates
- [ ] Verify changes are saved

**Test: Re-record after transcription**

- [ ] Complete a transcription
- [ ] Click "Erneut aufnehmen"
- [ ] Verify return to recording state
- [ ] Verify previous transcription is cleared
- [ ] Record new audio
- [ ] Verify new transcription replaces old

**Test: Transcription error handling**

- [ ] Record very short audio (< 1 second)
- [ ] Or record audio with no speech
- [ ] Verify error state displays
- [ ] Verify error message in German
- [ ] Verify options to:
  - [x] "Erneut versuchen" button
  - [x] "Stattdessen Text eingeben" button
- [ ] Verify both recovery paths work

**Test: Low confidence warning**

- [ ] Record audio with background noise or unclear speech
- [ ] Wait for transcription
- [ ] If confidence < 0.7, verify warning message displays
- [ ] Verify user can still edit and submit
- [ ] Verify no blocking of submission

---

### 4. Photo Upload

**Test: Add photos**

- [ ] Enter text or complete transcription
- [ ] Scroll to photo section
- [ ] Verify photo upload UI shows:
  - [x] "Fotos hinzufügen" button or drag-drop area
  - [x] "Bis zu 8 Fotos" limit notice
  - [x] Supported formats notice (JPEG, PNG)
- [ ] Click "Fotos hinzufügen"
- [ ] Select 1-2 photos from file picker
- [ ] Verify photos display as thumbnails
- [ ] Verify each thumbnail shows:
  - [x] Preview image
  - [x] File name or size
  - [x] Remove button (X)

**Test: Client-side resize**

- [ ] Select a large photo (> 5MB)
- [ ] Verify upload shows processing/loading state
- [ ] Wait for resize operation
- [ ] Verify photo is resized to < 2MB
- [ ] Verify preview displays correctly
- [ ] Check browser DevTools Network tab
- [ ] Verify upload size is < 2MB

**Test: Remove photos**

- [ ] Upload 2-3 photos
- [ ] Click remove button (X) on one photo
- [ ] Verify photo is removed from grid
- [ ] Verify remaining photos stay intact
- [ ] Verify can re-add photos

**Test: Maximum photo limit**

- [ ] Upload 8 photos
- [ ] Verify "Fotos hinzufügen" button is disabled
- [ ] Verify message: "Maximale Anzahl erreicht"
- [ ] Remove one photo
- [ ] Verify button is re-enabled

**Test: Unsupported file type**

- [ ] Attempt to upload .pdf or .gif file
- [ ] Verify error message in German
- [ ] Verify file is not added to grid
- [ ] Verify user can try again with valid format

**Test: Drag and drop**

- [ ] Drag photo file from desktop
- [ ] Drop on photo upload area
- [ ] Verify photo is added successfully
- [ ] Repeat for multiple files
- [ ] Verify same behavior as file picker

---

### 5. Accessibility Testing

**Test: Keyboard navigation**

- [ ] Navigate entire flow using only keyboard (Tab, Shift+Tab, Enter, Space, Escape)
- [ ] Verify all interactive elements are reachable
- [ ] Verify focus indicators are clearly visible (2px blue outline)
- [ ] Tab through text editor
- [ ] Tab to "Entwurf speichern" and "Absenden" buttons
- [ ] Activate buttons with Enter or Space
- [ ] Verify skip links work if present

**Test: Screen reader (NVDA/VoiceOver)**

- [ ] Enable screen reader
- [ ] Navigate through story input form
- [ ] Verify announcements:
  - [x] Form labels and instructions
  - [x] Character count updates
  - [x] Draft save status changes
  - [x] Error messages
  - [x] Recording state changes
  - [x] Transcription completion
- [ ] Verify ARIA live regions announce dynamic updates
- [ ] Verify all buttons have accessible names

**Test: Focus management**

- [ ] Click "Sprechen" mode
- [ ] Verify focus moves to recording button
- [ ] Start recording
- [ ] Stop recording
- [ ] Verify focus moves to transcription editor when ready
- [ ] Switch modes
- [ ] Verify focus moves to appropriate element

**Test: Touch targets (mobile)**

- [ ] Open `/test/story-flow` in mobile view (375px width)
- [ ] Verify all buttons are at least 44x44px
- [ ] Verify adequate spacing between touch targets
- [ ] Verify no accidental taps on adjacent elements
- [ ] Test on actual mobile device if available

**Test: Color contrast (WCAG AA)**

- [ ] Use browser DevTools or contrast checker
- [ ] Verify text has minimum 4.5:1 contrast ratio
- [ ] Verify UI components have 3:1 contrast
- [ ] Verify focus indicators have 3:1 contrast
- [ ] Test in dark mode if supported

---

### 6. Error Scenarios

**Test: Network failure during save**

- [ ] Open DevTools Network tab
- [ ] Set throttling to "Offline"
- [ ] Type text and click "Entwurf speichern"
- [ ] Verify error message displays
- [ ] Verify text is not lost
- [ ] Restore network
- [ ] Verify can retry save successfully

**Test: Network failure during transcription**

- [ ] Start recording
- [ ] Stop recording
- [ ] Immediately go offline
- [ ] Verify transcription fails gracefully
- [ ] Verify error message in German
- [ ] Verify recovery options displayed

**Test: Session timeout**

- [ ] (If auth is enabled) Let session expire
- [ ] Attempt to save draft
- [ ] Verify redirect to login or session renewal
- [ ] Verify draft is preserved after re-auth

**Test: Browser back button**

- [ ] Enter text or record voice
- [ ] Click browser back button
- [ ] Verify unsaved changes warning (if implemented)
- [ ] Or verify draft is auto-saved

**Test: Page refresh with unsaved changes**

- [ ] Enter text but don't save
- [ ] Refresh page
- [ ] Verify draft auto-save has preserved content
- [ ] Or verify warning if not auto-saved

---

### 7. Cross-Browser Testing

Test on each browser:

**Chrome/Edge (Chromium)**
- [ ] Text input works
- [ ] Voice recording works
- [ ] Photo upload works
- [ ] Visual design renders correctly

**Firefox**
- [ ] Text input works
- [ ] Voice recording works
- [ ] Photo upload works
- [ ] Visual design renders correctly

**Safari (macOS/iOS)**
- [ ] Text input works
- [ ] Voice recording works (check Safari permissions)
- [ ] Photo upload works
- [ ] Visual design renders correctly
- [ ] No iOS zoom on form focus (16px min font size)

**Mobile browsers**
- [ ] Chrome Android
- [ ] Safari iOS
- [ ] Samsung Internet
- [ ] Verify responsive layout
- [ ] Verify touch interactions work

---

### 8. Performance Testing

**Test: Large text performance**

- [ ] Paste 10,000 characters of text
- [ ] Verify no lag in character counter
- [ ] Type additional characters
- [ ] Verify editor remains responsive

**Test: Multiple photo uploads**

- [ ] Upload 8 photos simultaneously
- [ ] Verify resize operations don't block UI
- [ ] Verify progress indicators show for each
- [ ] Verify browser doesn't hang

**Test: Recording duration**

- [ ] Record for 5+ minutes
- [ ] Verify recording doesn't fail
- [ ] Verify file size is reasonable
- [ ] Verify transcription handles long audio

---

## Test Results

| Test Category | Status | Notes |
|---------------|--------|-------|
| Text Input | ⬜ | |
| Voice Recording | ⬜ | |
| Transcription | ⬜ | |
| Photo Upload | ⬜ | |
| Accessibility | ⬜ | |
| Error Scenarios | ⬜ | |
| Cross-Browser | ⬜ | |
| Performance | ⬜ | |

---

## Common Issues & Troubleshooting

### Microphone not working

- Check browser permissions (chrome://settings/content/microphone)
- Verify HTTPS is used (required for microphone access)
- Try different browser
- Check OS microphone permissions (macOS System Settings > Privacy)

### Transcription fails

- Verify `GLADIA_API_KEY` is set in `.env.local`
- Check Gladia API quota/limits
- Verify audio quality is sufficient
- Check browser console for API errors
- Test with clear, slow German speech

### Photos not uploading

- Verify S3 credentials are configured
- Check file size limits
- Check browser console for CORS errors
- Verify presigned URL generation works
- Test with smaller image files

### Draft not persisting

- Check browser localStorage is enabled
- Verify localStorage quota not exceeded
- Check browser console for errors
- Test in incognito mode to rule out extensions

### Character counter out of sync

- Check for special characters (emojis count as multiple)
- Verify UTF-8 encoding is correct
- Clear draft and re-enter text
- Report bug with specific text sample

---

## Manual Test Checklist (Quick Run)

Use this for quick regression testing:

- [ ] Text input: type, save draft, submit
- [ ] Voice: record, transcribe, edit, submit
- [ ] Photos: upload 2 photos, remove 1, submit
- [ ] Keyboard nav: Tab through all interactive elements
- [ ] Mobile: test on actual device (iPhone + Android)
- [ ] Error: test offline mode, verify recovery

---

## Browser Compatibility Notes

### Known Issues

**Safari iOS < 16:**
- Microphone recording may require user gesture
- Auto-save may be delayed due to background throttling

**Firefox:**
- Waveform visualization may have reduced performance
- Use fallback to simple level meter if needed

**Chrome Android:**
- File picker may show "Recent" files first
- Photo orientation may need EXIF correction

---

**Last Updated:** December 2024
