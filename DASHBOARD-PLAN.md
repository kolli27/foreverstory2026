# Story Author Dashboard Plan

## Design Philosophy
**Target User:** 70+ year old story author
**Primary Question:** "What question should I answer today?"
**Design Principle:** Clear hierarchy, large touch targets, minimal cognitive load

---

## 1. Dashboard Content & Information Hierarchy

### 🎯 PRIORITY 1: Current Question Card (Hero Section)
**Visual Treatment:** Large, prominent card with high contrast
- **Question text** (German, large 20-24px font)
- **Question category badge** (e.g., "Kindheit", "Familie")
- **Primary CTA button:** "Jetzt beantworten" (Answer now) → links to `/write`
- **Secondary action:** "Frage überspringen" (Skip question) - subtle, smaller

**Why First:** This answers the core user need immediately. No scrolling required.

### 📊 PRIORITY 2: Progress Indicator
**Visual Treatment:** Simple progress bar with clear numbers
- Visual bar showing completion (e.g., 12/52 questions)
- Text: "Sie haben 12 von 52 Fragen beantwortet" (You have answered 12 of 52 questions)
- Encouragement message when milestone reached

**Why Second:** Shows momentum and encourages continued engagement.

### 📝 PRIORITY 3: Recent Stories Section
**Visual Treatment:** List of 3-5 most recent stories with preview
- **Story card** showing:
  - Question text (truncated if long)
  - Date submitted (German format: "23.11.2024")
  - Word count or "Mit Aufnahme" (voice recording icon)
  - Small thumbnail if photo attached
  - Edit/View button
- **"Alle Geschichten ansehen" link** at bottom → future `/stories` page

**Why Third:** Provides context of recent work, enables quick edits.

### ⏰ PRIORITY 4: Subscription Status Banner
**Visual Treatment:** Subtle info banner at top or sidebar
- Days remaining: "Noch 143 Tage verbleibend"
- Plan type: "Standard-Abo"
- Soft visual (not alarming unless <14 days remain)

**Why Fourth:** Important but not urgent for daily use.

### 🔧 PRIORITY 5: Quick Actions (Optional for v1)
- "Buch-Vorschau erstellen" (Create book preview)
- "Familie einladen" (Invite family)
- Keep these subtle - avoid overwhelming the main task

---

## 2. Files to Create

### Pages
```
src/app/(dashboard)/dashboard/page.tsx
```
- Server Component that fetches all data
- Layout: Simple single-column layout (mobile-first)
- Auth-protected via middleware

### Components
```
src/components/dashboard/
├── current-question-card.tsx       # Hero question display with CTA
├── progress-indicator.tsx          # Progress bar with stats
├── recent-story-card.tsx           # Individual story preview card
├── recent-stories-list.tsx         # Container for recent stories
├── subscription-banner.tsx         # Shows days remaining, plan info
└── empty-state.tsx                 # For users with no active subscription
```

### Data Layer
```
src/lib/dashboard.ts
```
- `getDashboardData(userId: string)` - Server-side function that fetches:
  - Active subscription
  - Current question (from QuestionDelivery)
  - Recent stories (last 5)
  - Progress stats (answered/total)
  - Days remaining calculation

**Option:** Could create `/api/dashboard` route, but Server Component direct DB query is simpler.

---

## 3. Data Fetching Strategy

### Server Component Approach (Preferred)
**Why:** Simpler, faster, no loading states for user, better SEO

```typescript
// src/app/(dashboard)/dashboard/page.tsx
export default async function DashboardPage() {
  const session = await getServerSession();
  const data = await getDashboardData(session.user.id);

  return (
    <div>
      <CurrentQuestionCard question={data.currentQuestion} />
      <ProgressIndicator stats={data.progress} />
      <RecentStoriesList stories={data.recentStories} />
      <SubscriptionBanner subscription={data.subscription} />
    </div>
  );
}
```

### Database Queries Needed
```typescript
// src/lib/dashboard.ts

interface DashboardData {
  subscription: {
    id: string;
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    daysRemaining: number;
    endDate: Date | null;
  } | null;

  currentQuestion: {
    id: string;
    textDe: string;
    category: QuestionCategory;
    deliveryId: string; // For tracking skip/answer
  } | null;

  progress: {
    answeredCount: number;
    totalQuestions: number;
    percentComplete: number;
  };

  recentStories: Array<{
    id: string;
    title: string | null;
    questionText: string;
    createdAt: Date;
    wordCount: number;
    hasAudio: boolean;
    hasPhotos: boolean;
    status: StoryStatus;
  }>;
}
```

**Queries:**
1. Get active subscription for user (status = ACTIVE)
2. Get current unanswered question from QuestionDelivery
3. Get count of answered vs total questions
4. Get last 5 stories ordered by createdAt DESC

---

## 4. German Copy (Formal "Sie")

### Current Question Card
- **Heading:** "Ihre Frage diese Woche" (Your question this week)
- **CTA:** "Jetzt beantworten" (Answer now)
- **Secondary:** "Frage überspringen" (Skip question)
- **Category Labels:**
  - CHILDHOOD → "Kindheit"
  - EDUCATION → "Ausbildung"
  - CAREER → "Beruf"
  - FAMILY → "Familie"
  - WAR_POSTWAR → "Krieg und Nachkriegszeit"
  - DDR → "DDR-Erinnerungen"
  - REUNIFICATION → "Wiedervereinigung"
  - TRADITIONS → "Traditionen"
  - LIFE_LESSONS → "Lebenserfahrung"

### Progress Section
- **Heading:** "Ihr Fortschritt"
- **Text:** "{count} von {total} Fragen beantwortet"
- **Encouragement (optional):**
  - 25%: "Ein guter Anfang!"
  - 50%: "Halbzeit! Weiter so!"
  - 75%: "Fast geschafft!"

### Recent Stories
- **Heading:** "Ihre letzten Geschichten"
- **Empty state:** "Sie haben noch keine Geschichten verfasst. Beantworten Sie Ihre erste Frage!"
- **View all link:** "Alle Geschichten ansehen →"
- **Edit button:** "Bearbeiten"
- **View button:** "Ansehen"
- **Date format:** "23. November 2024"
- **Word count:** "{count} Wörter"
- **Voice indicator:** "Mit Aufnahme"

### Subscription Banner
- **Days remaining:** "Noch {days} Tage verbleibend"
- **Plan names:**
  - STARTER → "Basis-Abo"
  - STANDARD → "Standard-Abo"
  - PREMIUM → "Premium-Abo"
- **Warning (<14 days):** "Ihr Abo läuft bald ab. Möchten Sie verlängern?"

### Empty State (No Active Subscription)
- **Heading:** "Kein aktives Abonnement"
- **Message:** "Sie haben derzeit kein aktives Story-Abonnement. Kontaktieren Sie die Person, die Ihnen dieses Geschenk gemacht hat, oder beginnen Sie selbst ein Abonnement."
- **CTA:** "Mehr erfahren"

---

## 5. Accessibility Considerations

### Touch Targets
- All buttons minimum 44x44px
- "Jetzt beantworten" button: 48-56px height, full-width on mobile

### Typography
- Body text: 16px minimum (18px preferred)
- Question text: 20-24px
- Headings: 24-32px
- Line height: 1.6-1.8 for readability

### Color Contrast
- Use high contrast for all text (WCAG AA minimum 4.5:1)
- Primary CTA: Strong color contrast
- Avoid relying on color alone for information

### Keyboard Navigation
- All interactive elements keyboard accessible
- Logical tab order (question card → progress → stories)
- Visible focus indicators

### Screen Reader Support
- Semantic HTML (main, section, article)
- Proper heading hierarchy (h1 → h2 → h3)
- ARIA labels where needed
- Alt text for any icons

---

## 6. Mobile-First Layout

### Mobile (< 768px)
```
┌─────────────────────────┐
│  Subscription Banner    │
├─────────────────────────┤
│                         │
│  Current Question Card  │
│  (Large, prominent)     │
│                         │
│  [Jetzt beantworten]    │
│  [Frage überspringen]   │
│                         │
├─────────────────────────┤
│  Progress Bar           │
│  12 von 52 beantwortet  │
├─────────────────────────┤
│  Ihre letzten           │
│  Geschichten            │
│                         │
│  ┌─Story Card 1───┐    │
│  └────────────────┘    │
│  ┌─Story Card 2───┐    │
│  └────────────────┘    │
│  ┌─Story Card 3───┐    │
│  └────────────────┘    │
│                         │
│  → Alle ansehen         │
└─────────────────────────┘
```

### Desktop (≥ 768px)
```
┌────────────────────────────────────────┐
│          Subscription Banner            │
├────────────────┬───────────────────────┤
│                │                       │
│   Current      │   Progress            │
│   Question     │   Indicator           │
│   Card         │                       │
│   (2/3 width)  │   Recent Stories      │
│                │   (1/3 width,         │
│                │    sidebar)           │
│                │                       │
└────────────────┴───────────────────────┘
```

**OR** keep single column even on desktop for simplicity - less cognitive load for elderly users.

---

## 7. Edge Cases to Handle

### No Active Subscription
- Show empty state with clear message
- Explain how to activate or purchase
- No current question shown

### No Current Question
- All questions answered: "Glückwunsch! Sie haben alle Fragen beantwortet."
- CTA: "Buch erstellen" or "Weitere Fragen hinzufügen"

### No Recent Stories
- Empty state: "Sie haben noch keine Geschichten verfasst."
- CTA: Encourage answering first question

### Subscription Ending Soon (<14 days)
- Warning banner: "Ihr Abo läuft in {days} Tagen ab."
- CTA to extend or contact support

---

## 8. Implementation Order

1. **Create data layer** (`src/lib/dashboard.ts`)
   - Database queries
   - Data transformation
   - Type definitions

2. **Build UI components** (simplest to complex)
   - ProgressIndicator (pure presentation)
   - SubscriptionBanner (simple data display)
   - RecentStoryCard (needs formatting utils)
   - CurrentQuestionCard (includes CTAs)
   - RecentStoriesList (container)
   - EmptyState (conditional rendering)

3. **Create dashboard page** (`src/app/(dashboard)/dashboard/page.tsx`)
   - Server Component with auth
   - Fetch data
   - Compose components
   - Handle loading/error states

4. **Add utility functions**
   - `formatGermanDate()` - format dates
   - `calculateDaysRemaining()` - date math
   - `getCategoryLabel()` - translate categories

5. **Test with real data**
   - Seed database with test stories
   - Test all states (empty, active, ending soon)
   - Test on mobile and desktop

---

## 9. Future Enhancements (Not v1)

- Weekly question history calendar view
- Streak counter ("7 Wochen in Folge!")
- Family activity feed (when family members read stories)
- Book preview thumbnail
- Question suggestions based on incomplete categories
- Voice recording directly from dashboard

---

## 10. Success Metrics

**User understands immediately:**
- ✅ What question to answer today
- ✅ How much progress they've made
- ✅ How to start writing
- ✅ Where to find past stories

**Technical:**
- ✅ Page loads in <2s
- ✅ Zero layout shift (CLS = 0)
- ✅ Fully accessible (keyboard + screen reader)
- ✅ Works offline (shows cached data)

---

*Ready for review and implementation.*
