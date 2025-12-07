# ForeverStory Project - CLAUDE.md

## Project Overview
ForeverStory is a German-market story preservation platform (similar to StoryWorth) that helps families capture and preserve life memories through weekly question prompts, voice recording, and printed keepsake books.

**Target Market:** DACH region (Germany, Austria, Switzerland)
**Primary Users:** Gift givers (35-55), Story authors (65+), Family readers
**Core Value:** "Preserve the stories that matter most — before they're lost forever"

---

## Tech Stack

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **State:** React Query for server state, Zustand for client state
- **Forms:** React Hook Form + Zod validation

### Backend
- **Runtime:** Node.js 20+
- **Framework:** NestJS or Express
- **Database:** PostgreSQL 15+
- **ORM:** Prisma
- **Cache:** Redis
- **Storage:** AWS S3 (eu-central-1) or Hetzner Object Storage

### Infrastructure
- **Hosting:** Hetzner Cloud (Falkenstein/Nuremberg) or AWS Frankfurt
- **CI/CD:** GitHub Actions
- **Containerization:** Docker + Docker Compose

---

## Bash Commands

```bash
# Development
npm run dev              # Start Next.js dev server
npm run build            # Production build
npm run start            # Start production server
npm run typecheck        # Run TypeScript compiler check
npm run lint             # ESLint check
npm run lint:fix         # Auto-fix lint issues
npm run test             # Run Jest tests
npm run test:watch       # Watch mode for tests
npm run test:e2e         # Playwright E2E tests

# Database
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database with test data
npm run db:studio        # Open Prisma Studio

# Docker
docker-compose up -d     # Start all services
docker-compose down      # Stop all services
docker-compose logs -f   # Follow logs
```

---

## Code Style Guidelines

### TypeScript
- ALWAYS use strict TypeScript — no `any` types without explicit justification
- Use `interface` for object shapes, `type` for unions/intersections
- Prefer `const` assertions for literal types
- Export types from a central `types/` directory

### React/Next.js
- Use Server Components by default, Client Components only when needed
- Prefer `use server` actions over API routes for mutations
- Use `Suspense` boundaries with meaningful loading states
- Keep components small — extract logic to custom hooks

### Naming Conventions
```typescript
// Components: PascalCase
export function StoryCard() {}

// Hooks: camelCase with "use" prefix  
export function useStories() {}

// Utils/helpers: camelCase
export function formatGermanDate() {}

// Constants: SCREAMING_SNAKE_CASE
export const MAX_STORY_LENGTH = 10000;

// Types/Interfaces: PascalCase with descriptive names
interface StorySubmission {}
type PaymentStatus = 'pending' | 'completed' | 'failed';
```

### File Structure
```
src/
├── app/                 # Next.js App Router pages
├── components/
│   ├── ui/             # Reusable UI primitives (Button, Input, etc.)
│   └── features/       # Feature-specific components
├── hooks/              # Custom React hooks
├── lib/                # Utilities, API clients, helpers
├── types/              # TypeScript type definitions
└── styles/             # Global styles
```

---

## German Localization Rules

### IMPORTANT: Language & Tone
- Default to **"Sie" (formal)** for all user-facing text
- Target demographic is 65+ for story authors — use clear, simple language
- Avoid anglicisms where German equivalents exist
- Use German date format: `DD.MM.YYYY`
- Use German number format: `1.234,56 €`

### Key Translations Reference
```
Stories = Geschichten
Questions = Fragen
Book = Buch
Family = Familie
Memories = Erinnerungen
Gift = Geschenk
Subscribe = Abonnieren
Submit = Absenden
```

### Regional Question Categories
- `childhood` - Kindheit
- `education` - Ausbildung
- `career` - Beruf
- `family` - Familie
- `war_postwar` - Krieg und Nachkriegszeit
- `ddr` - DDR-Erinnerungen (East Germany specific)
- `reunification` - Wiedervereinigung
- `traditions` - Traditionen

---

## Database Schema (Core Tables)

```prisma
// Reference these models when working with database
model User {
  id, email, role (GIFT_GIVER | STORY_AUTHOR | READER)
}

model Subscription {
  id, userId, plan, status, startDate, endDate
}

model Story {
  id, authorId, questionId, content, audioUrl, photos[], status, createdAt
}

model Question {
  id, textDe, textEn, category, region, sortOrder
}

model Book {
  id, subscriptionId, status, printedAt, trackingNumber
}

model FamilyMember {
  id, subscriptionId, email, role, invitedAt, acceptedAt
}
```

---

## API Patterns

### REST Endpoints
```
GET    /api/stories           # List user's stories
POST   /api/stories           # Create new story
GET    /api/stories/:id       # Get single story
PATCH  /api/stories/:id       # Update story
DELETE /api/stories/:id       # Delete story

GET    /api/questions         # Get question queue
POST   /api/questions/skip    # Skip current question

POST   /api/subscriptions     # Create subscription (gift purchase)
GET    /api/subscriptions/:id # Get subscription details

POST   /api/books/preview     # Generate book preview PDF
POST   /api/books/order       # Submit book for printing
```

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Die E-Mail-Adresse ist ungültig.",
    "details": {}
  }
}
```

---

## Testing Instructions

### Unit Tests
- Use Jest + React Testing Library
- Test files: `*.test.ts` or `*.test.tsx` next to source files
- Mock external services (Stripe, S3, email)
- Aim for 80%+ coverage on business logic

### E2E Tests
- Use Playwright
- Test critical user flows: gift purchase, story submission, book preview
- Run against staging environment before deploy

### Running Tests
```bash
# Run single test file (preferred for speed)
npm run test -- src/lib/pricing.test.ts

# Run tests matching pattern
npm run test -- --testNamePattern="calculates discount"

# Run with coverage
npm run test -- --coverage
```

---

## Environment Variables

```bash
# Required for development
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET=foreverstory-dev

# Voice transcription
GOOGLE_CLOUD_PROJECT=...
# OR
GLADIA_API_KEY=...

# Email
MAILGUN_API_KEY=...
MAILGUN_DOMAIN=...

# Optional
SENTRY_DSN=...
```

---

## Third-Party Integrations

### Stripe (Payments)
- Use Stripe Checkout for subscriptions
- Support: SEPA, Klarna, PayPal, Credit Cards
- Webhook events: `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted`

### Voice-to-Text
- Primary: Google Cloud Speech-to-Text (Chirp 3 model)
- Fallback: Gladia API
- IMPORTANT: Always specify `languageCode: 'de-DE'`

### Book Printing
- Primary partner: CEWE (via Peecho API)
- Book specs: 6x9", hardcover, up to 480 pages
- Allow 8-12 business days for printing + shipping

### Email
- Transactional: Mailgun (weekly prompts, notifications)
- Marketing: Brevo (formerly Sendinblue)

---

## GDPR & Compliance Checklist

- [ ] Privacy policy (Datenschutzerklärung) on all pages
- [ ] Impressum (legal notice) required by German law
- [ ] Cookie consent banner (TTDSG compliant)
- [ ] Data export endpoint for GDPR Art. 20
- [ ] Account deletion with full data removal
- [ ] Consent logging for all data processing
- [ ] Data Processing Agreements with all vendors
- [ ] EU-only data storage (no US transfers without SCCs)

---

## Common Gotchas & Warnings

### ⚠️ Voice Recording
- German speech recognition accuracy varies by dialect
- Always offer text input as fallback
- Audio files must be stored in EU region only

### ⚠️ Elderly User UX
- Minimum touch target: 44x44px
- Minimum font size: 16px body, 14px minimum
- High contrast mode support required
- Avoid infinite scroll — use pagination

### ⚠️ Payment Processing
- Klarna has strict content policies — no memorial/funeral content in product descriptions
- SEPA Direct Debit requires mandate acceptance flow
- Store Stripe customer IDs, never card details

### ⚠️ Book Generation
- Max 480 pages per book
- Images must be minimum 300 DPI for print
- PDF generation can be memory-intensive — use worker process

---

## Workflow Reminders

### Before Starting a Feature
1. Check if similar functionality exists in codebase
2. Review German localization requirements
3. Consider elderly user accessibility needs
4. Plan database migrations if needed

### Before Committing
1. Run `npm run typecheck` — must pass with zero errors
2. Run `npm run lint` — fix all warnings
3. Run relevant tests
4. Update CHANGELOG.md for user-facing changes

### PR Checklist
- [ ] TypeScript strict mode passes
- [ ] Tests added/updated
- [ ] German translations added
- [ ] Accessibility tested (keyboard nav, screen reader)
- [ ] Mobile responsive verified
- [ ] No console.log statements
- [ ] Environment variables documented if new

---

## Key Files Reference

```
src/lib/pricing.ts          # Subscription pricing logic
src/lib/questions.ts        # Question delivery system
src/lib/book-generator.ts   # PDF/book compilation
src/lib/transcription.ts    # Voice-to-text wrapper
src/lib/email.ts            # Email sending utilities
src/lib/stripe.ts           # Stripe integration

src/components/ui/          # Shared UI components
src/app/[locale]/           # i18n routing (de, en)
src/app/api/                # API routes

prisma/schema.prisma        # Database schema
prisma/seed.ts              # Development seed data
```

---

## Useful Commands for Claude

```bash
# Find all TODO comments
grep -r "TODO" src/

# Check for German translation keys
grep -r "t\('" src/ | head -20

# List all API routes
find src/app/api -name "route.ts"

# Check bundle size
npm run build && npx @next/bundle-analyzer

# Database state
npx prisma studio
```

---

## Contact & Resources

- **Project Docs:** /docs folder
- **Design System:** Figma link (ask founder)
- **Competitor Reference:** StoryWorth.com, Meminto.com
- **CEWE Partner Docs:** [internal link]

---

*Last updated: December 2024*
