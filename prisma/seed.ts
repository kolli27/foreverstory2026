/**
 * Database Seed Script for ForeverStory
 * 
 * Run with: npm run db:seed
 * Requires: npm run db:generate first
 */

// Note: This requires tsx to run TypeScript files directly
// Install with: npm install -D tsx
// Also requires Prisma client to be generated: npm run db:generate

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Sample questions for seeding
const SEED_QUESTIONS = [
  {
    textDe: 'Was ist Ihre früheste Kindheitserinnerung?',
    textEn: 'What is your earliest childhood memory?',
    category: 'CHILDHOOD' as const,
    region: 'ALL' as const,
  },
  {
    textDe: 'Wo sind Sie aufgewachsen und wie war Ihr Zuhause?',
    textEn: 'Where did you grow up and what was your home like?',
    category: 'CHILDHOOD' as const,
    region: 'ALL' as const,
  },
  {
    textDe: 'Was war Ihr Lieblingsspielzeug oder -spiel als Kind?',
    textEn: 'What was your favorite toy or game as a child?',
    category: 'CHILDHOOD' as const,
    region: 'ALL' as const,
  },
  {
    textDe: 'Wie war Ihr erster Schultag?',
    textEn: 'What was your first day of school like?',
    category: 'EDUCATION' as const,
    region: 'ALL' as const,
  },
  {
    textDe: 'Wer war Ihr Lieblingslehrer und warum?',
    textEn: 'Who was your favorite teacher and why?',
    category: 'EDUCATION' as const,
    region: 'ALL' as const,
  },
  {
    textDe: 'Was war Ihr erster Job und wie haben Sie ihn bekommen?',
    textEn: 'What was your first job and how did you get it?',
    category: 'CAREER' as const,
    region: 'ALL' as const,
  },
  {
    textDe: 'Wie haben Sie Ihren Partner / Ihre Partnerin kennengelernt?',
    textEn: 'How did you meet your partner?',
    category: 'FAMILY' as const,
    region: 'ALL' as const,
  },
  {
    textDe: 'Was ist Ihre schönste Erinnerung an Ihre Hochzeit?',
    textEn: 'What is your best memory of your wedding?',
    category: 'FAMILY' as const,
    region: 'ALL' as const,
  },
  {
    textDe: 'Wie haben Sie früher Weihnachten gefeiert?',
    textEn: 'How did you celebrate Christmas in the past?',
    category: 'TRADITIONS' as const,
    region: 'ALL' as const,
  },
  {
    textDe: 'Was ist die wichtigste Lektion, die Sie im Leben gelernt haben?',
    textEn: 'What is the most important lesson you have learned in life?',
    category: 'LIFE_LESSONS' as const,
    region: 'ALL' as const,
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Seed questions
  console.log('📝 Seeding questions...');
  
  for (const [index, question] of SEED_QUESTIONS.entries()) {
    await prisma.question.upsert({
      where: {
        id: `seed-question-${index}`,
      },
      update: {},
      create: {
        id: `seed-question-${index}`,
        textDe: question.textDe,
        textEn: question.textEn,
        category: question.category,
        region: question.region,
        sortOrder: index,
        isActive: true,
      },
    });
  }

  console.log(`✅ Seeded ${SEED_QUESTIONS.length} questions`);

  // Create test user (development only)
  if (process.env.NODE_ENV !== 'production') {
    console.log('👤 Creating test users...');

    // Test gift giver
    const giftGiver = await prisma.user.upsert({
      where: { email: 'gift-giver@test.de' },
      update: {},
      create: {
        email: 'gift-giver@test.de',
        firstName: 'Thomas',
        lastName: 'Müller',
        role: 'GIFT_GIVER',
        locale: 'de',
      },
    });

    // Test story author
    const storyAuthor = await prisma.user.upsert({
      where: { email: 'story-author@test.de' },
      update: {},
      create: {
        email: 'story-author@test.de',
        firstName: 'Helga',
        lastName: 'Schmidt',
        role: 'STORY_AUTHOR',
        locale: 'de',
      },
    });

    // Test subscription
    await prisma.subscription.upsert({
      where: { id: 'test-subscription-1' },
      update: {},
      create: {
        id: 'test-subscription-1',
        giftGiverId: giftGiver.id,
        storyAuthorId: storyAuthor.id,
        storyAuthorEmail: storyAuthor.email,
        plan: 'STANDARD',
        status: 'ACTIVE',
        activatedAt: new Date(),
        startDate: new Date(),
        endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
        giftMessage: 'Liebe Mama, ich möchte deine Geschichten für immer bewahren. Dein Thomas',
        questionFrequency: 'weekly',
        preferredDay: 1,
      },
    });

    console.log('✅ Created test users and subscription');
  }

  console.log('🎉 Database seeding complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
