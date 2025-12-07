# ForeverStory

**Bewahren Sie die Geschichten, die am wichtigsten sind** – bevor sie für immer verloren gehen.

ForeverStory is a German-market story preservation platform (similar to StoryWorth) that helps families capture and preserve life memories through weekly question prompts, voice recording, and printed keepsake books.

## 🎯 Target Market

- **Region:** DACH (Germany, Austria, Switzerland)
- **Primary Users:** Gift givers (35-55), Story authors (65+), Family readers
- **Core Value:** "Preserve the stories that matter most – before they're lost forever"

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis (optional, for caching)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/foreverstory.git
cd foreverstory

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Set up the database
npm run db:generate
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📁 Project Structure

```
foreverstory/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── [locale]/      # i18n routing (de, en)
│   │   └── api/           # API routes
│   ├── components/
│   │   ├── ui/            # Reusable UI primitives
│   │   └── features/      # Feature-specific components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities, API clients, helpers
│   ├── messages/          # i18n translation files
│   ├── styles/            # Global styles
│   └── types/             # TypeScript type definitions
└── public/                # Static assets
```

## 🛠 Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **State:** React Query + Zustand
- **Forms:** React Hook Form + Zod
- **Database:** PostgreSQL + Prisma
- **Payments:** Stripe

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Start production server
npm run typecheck        # TypeScript check
npm run lint             # ESLint check
npm run lint:fix         # Auto-fix lint issues

# Database
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio

# Testing
npm run test             # Run Jest tests
npm run test:watch       # Watch mode
npm run test:e2e         # Playwright E2E tests
```

## 🌍 Localization

Default language is German (formal "Sie" form). All user-facing text uses the translation system.

**Key translations:**
- Stories = Geschichten
- Questions = Fragen
- Book = Buch
- Family = Familie

German date format: `DD.MM.YYYY`
German number format: `1.234,56 €`

## ♿ Accessibility

Following WCAG 2.1 AA guidelines with special consideration for elderly users:

- Minimum touch target: 44x44px
- Minimum font size: 16px body
- High contrast mode support
- Keyboard navigation
- Screen reader compatible

## 📄 License

Private - All rights reserved

## 🤝 Contributing

See [CLAUDE.md](./CLAUDE.md) for development guidelines and code style.
