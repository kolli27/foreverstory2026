/**
 * Question Delivery System
 * Manages the weekly question queue for story authors
 */

import type { QuestionCategory } from '@/types';

// ============================================
// Question Categories with German Labels
// ============================================

export const QUESTION_CATEGORIES: Record<
  QuestionCategory,
  { labelDe: string; labelEn: string; description: string; sortOrder: number }
> = {
  CHILDHOOD: {
    labelDe: 'Kindheit',
    labelEn: 'Childhood',
    description: 'Fragen über frühe Jahre, Familie und Kindheitserinnerungen',
    sortOrder: 1,
  },
  EDUCATION: {
    labelDe: 'Ausbildung',
    labelEn: 'Education',
    description: 'Schule, Ausbildung, Studium und Lernwege',
    sortOrder: 2,
  },
  CAREER: {
    labelDe: 'Beruf',
    labelEn: 'Career',
    description: 'Arbeitsleben, Karriere und berufliche Erfahrungen',
    sortOrder: 3,
  },
  FAMILY: {
    labelDe: 'Familie',
    labelEn: 'Family',
    description: 'Familiengründung, Kinder und Familienleben',
    sortOrder: 4,
  },
  RELATIONSHIPS: {
    labelDe: 'Beziehungen',
    labelEn: 'Relationships',
    description: 'Freundschaften, Liebe und wichtige Menschen',
    sortOrder: 5,
  },
  WAR_POSTWAR: {
    labelDe: 'Krieg und Nachkriegszeit',
    labelEn: 'War and post-war period',
    description: 'Erinnerungen an Krieg, Wiederaufbau und Nachkriegszeit',
    sortOrder: 6,
  },
  DDR: {
    labelDe: 'DDR-Erinnerungen',
    labelEn: 'GDR memories',
    description: 'Leben in der DDR und Alltagserfahrungen',
    sortOrder: 7,
  },
  REUNIFICATION: {
    labelDe: 'Wiedervereinigung',
    labelEn: 'Reunification',
    description: 'Die Wende und Wiedervereinigung Deutschlands',
    sortOrder: 8,
  },
  TRADITIONS: {
    labelDe: 'Traditionen',
    labelEn: 'Traditions',
    description: 'Familientraditionen, Feste und Bräuche',
    sortOrder: 9,
  },
  LIFE_LESSONS: {
    labelDe: 'Lebensweisheiten',
    labelEn: 'Life lessons',
    description: 'Erkenntnisse, Ratschläge und Lebenserfahrungen',
    sortOrder: 10,
  },
  CUSTOM: {
    labelDe: 'Persönliche Fragen',
    labelEn: 'Personal questions',
    description: 'Individuelle Fragen von Familienmitgliedern',
    sortOrder: 11,
  },
};

// ============================================
// Default Question Bank
// ============================================

export interface DefaultQuestion {
  textDe: string;
  textEn: string;
  category: QuestionCategory;
  region: 'ALL' | 'WEST_GERMANY' | 'EAST_GERMANY' | 'AUSTRIA' | 'SWITZERLAND';
}

export const DEFAULT_QUESTIONS: DefaultQuestion[] = [
  // CHILDHOOD
  {
    textDe: 'Was ist Ihre früheste Kindheitserinnerung?',
    textEn: 'What is your earliest childhood memory?',
    category: 'CHILDHOOD',
    region: 'ALL',
  },
  {
    textDe: 'Wo sind Sie aufgewachsen und wie war Ihr Zuhause?',
    textEn: 'Where did you grow up and what was your home like?',
    category: 'CHILDHOOD',
    region: 'ALL',
  },
  {
    textDe: 'Was war Ihr Lieblingsspielzeug oder -spiel als Kind?',
    textEn: 'What was your favorite toy or game as a child?',
    category: 'CHILDHOOD',
    region: 'ALL',
  },
  {
    textDe: 'Erzählen Sie von Ihren Geschwistern und wie Sie zusammen aufgewachsen sind.',
    textEn: 'Tell us about your siblings and how you grew up together.',
    category: 'CHILDHOOD',
    region: 'ALL',
  },
  {
    textDe: 'Welche Familientraditionen gab es in Ihrer Kindheit?',
    textEn: 'What family traditions did you have during your childhood?',
    category: 'CHILDHOOD',
    region: 'ALL',
  },

  // EDUCATION
  {
    textDe: 'Wie war Ihr erster Schultag?',
    textEn: 'What was your first day of school like?',
    category: 'EDUCATION',
    region: 'ALL',
  },
  {
    textDe: 'Wer war Ihr Lieblingslehrer und warum?',
    textEn: 'Who was your favorite teacher and why?',
    category: 'EDUCATION',
    region: 'ALL',
  },
  {
    textDe: 'Was war Ihr Lieblingsfach in der Schule?',
    textEn: 'What was your favorite subject in school?',
    category: 'EDUCATION',
    region: 'ALL',
  },

  // CAREER
  {
    textDe: 'Was war Ihr erster Job und wie haben Sie ihn bekommen?',
    textEn: 'What was your first job and how did you get it?',
    category: 'CAREER',
    region: 'ALL',
  },
  {
    textDe: 'Erzählen Sie von Ihrem größten beruflichen Erfolg.',
    textEn: 'Tell us about your greatest professional achievement.',
    category: 'CAREER',
    region: 'ALL',
  },
  {
    textDe: 'Welchen Beruf wollten Sie als Kind ergreifen?',
    textEn: 'What job did you want to have as a child?',
    category: 'CAREER',
    region: 'ALL',
  },

  // FAMILY
  {
    textDe: 'Wie haben Sie Ihren Partner / Ihre Partnerin kennengelernt?',
    textEn: 'How did you meet your partner?',
    category: 'FAMILY',
    region: 'ALL',
  },
  {
    textDe: 'Was ist Ihre schönste Erinnerung an Ihre Hochzeit?',
    textEn: 'What is your best memory of your wedding?',
    category: 'FAMILY',
    region: 'ALL',
  },
  {
    textDe: 'Erzählen Sie von der Geburt Ihrer Kinder.',
    textEn: 'Tell us about the birth of your children.',
    category: 'FAMILY',
    region: 'ALL',
  },
  {
    textDe: 'Welche Werte wollten Sie Ihren Kindern mitgeben?',
    textEn: 'What values did you want to pass on to your children?',
    category: 'FAMILY',
    region: 'ALL',
  },

  // RELATIONSHIPS
  {
    textDe: 'Wer war Ihr bester Freund in der Kindheit und was haben Sie zusammen erlebt?',
    textEn: 'Who was your best friend in childhood and what did you experience together?',
    category: 'RELATIONSHIPS',
    region: 'ALL',
  },
  {
    textDe: 'Erzählen Sie von einer Person, die Ihr Leben geprägt hat.',
    textEn: 'Tell us about a person who shaped your life.',
    category: 'RELATIONSHIPS',
    region: 'ALL',
  },

  // WAR_POSTWAR
  {
    textDe: 'Wie haben Sie den Krieg und die Nachkriegszeit erlebt?',
    textEn: 'How did you experience the war and post-war period?',
    category: 'WAR_POSTWAR',
    region: 'ALL',
  },
  {
    textDe: 'Was erinnern Sie sich an den Wiederaufbau nach dem Krieg?',
    textEn: 'What do you remember about the reconstruction after the war?',
    category: 'WAR_POSTWAR',
    region: 'ALL',
  },

  // DDR (East Germany specific)
  {
    textDe: 'Wie war der Alltag in der DDR?',
    textEn: 'What was everyday life like in the GDR?',
    category: 'DDR',
    region: 'EAST_GERMANY',
  },
  {
    textDe: 'Welche Erinnerungen haben Sie an die Jugendweihe?',
    textEn: 'What memories do you have of the Jugendweihe ceremony?',
    category: 'DDR',
    region: 'EAST_GERMANY',
  },

  // REUNIFICATION
  {
    textDe: 'Wo waren Sie am 9. November 1989 und wie haben Sie den Mauerfall erlebt?',
    textEn: 'Where were you on November 9, 1989 and how did you experience the fall of the Berlin Wall?',
    category: 'REUNIFICATION',
    region: 'ALL',
  },
  {
    textDe: 'Wie hat die Wiedervereinigung Ihr Leben verändert?',
    textEn: 'How did reunification change your life?',
    category: 'REUNIFICATION',
    region: 'ALL',
  },

  // TRADITIONS
  {
    textDe: 'Wie haben Sie früher Weihnachten gefeiert?',
    textEn: 'How did you celebrate Christmas in the past?',
    category: 'TRADITIONS',
    region: 'ALL',
  },
  {
    textDe: 'Welches traditionelle Familienrezept möchten Sie weitergeben?',
    textEn: 'What traditional family recipe would you like to pass on?',
    category: 'TRADITIONS',
    region: 'ALL',
  },
  {
    textDe: 'Welche Familienrituale sind Ihnen besonders wichtig?',
    textEn: 'Which family rituals are particularly important to you?',
    category: 'TRADITIONS',
    region: 'ALL',
  },

  // LIFE_LESSONS
  {
    textDe: 'Was ist die wichtigste Lektion, die Sie im Leben gelernt haben?',
    textEn: 'What is the most important lesson you have learned in life?',
    category: 'LIFE_LESSONS',
    region: 'ALL',
  },
  {
    textDe: 'Welchen Rat würden Sie Ihrem jüngeren Ich geben?',
    textEn: 'What advice would you give to your younger self?',
    category: 'LIFE_LESSONS',
    region: 'ALL',
  },
  {
    textDe: 'Was macht Sie glücklich?',
    textEn: 'What makes you happy?',
    category: 'LIFE_LESSONS',
    region: 'ALL',
  },
  {
    textDe: 'Worauf sind Sie in Ihrem Leben am meisten stolz?',
    textEn: 'What are you most proud of in your life?',
    category: 'LIFE_LESSONS',
    region: 'ALL',
  },
];

// ============================================
// Question Selection Logic
// ============================================

export function getQuestionsForPlan(plan: 'STARTER' | 'STANDARD' | 'PREMIUM'): number {
  const questionsPerPlan = {
    STARTER: 12,
    STANDARD: 26,
    PREMIUM: 52,
  };
  return questionsPerPlan[plan];
}

export function getNextDeliveryDate(
  lastDelivery: Date,
  frequency: 'weekly' | 'biweekly',
  preferredDay: number
): Date {
  const daysToAdd = frequency === 'weekly' ? 7 : 14;
  const nextDate = new Date(lastDelivery);
  nextDate.setDate(nextDate.getDate() + daysToAdd);
  
  const currentDay = nextDate.getDay();
  const targetDay = preferredDay === 7 ? 0 : preferredDay;
  const diff = targetDay - currentDay;
  
  if (diff !== 0) {
    nextDate.setDate(nextDate.getDate() + diff);
  }
  
  nextDate.setHours(9, 0, 0, 0);
  return nextDate;
}

export function buildQuestionQueue(params: {
  totalQuestions: number;
  region: 'WEST_GERMANY' | 'EAST_GERMANY' | 'AUSTRIA' | 'SWITZERLAND' | 'ALL';
  customQuestions?: string[];
  excludeCategories?: QuestionCategory[];
}): DefaultQuestion[] {
  const { totalQuestions, region, customQuestions = [], excludeCategories = [] } = params;
  
  const availableQuestions = DEFAULT_QUESTIONS.filter((q) => {
    if (excludeCategories.includes(q.category)) return false;
    if (q.region === 'ALL') return true;
    return q.region === region;
  });
  
  const byCategory = availableQuestions.reduce(
    (acc, q) => {
      if (!acc[q.category]) acc[q.category] = [];
      acc[q.category].push(q);
      return acc;
    },
    {} as Record<QuestionCategory, DefaultQuestion[]>
  );
  
  const queue: DefaultQuestion[] = [];
  const categories = Object.keys(byCategory) as QuestionCategory[];
  let categoryIndex = 0;
  
  while (queue.length < totalQuestions - customQuestions.length && categories.length > 0) {
    const currentCategory = categories[categoryIndex % categories.length];
    if (!currentCategory) break;
    
    const categoryQuestions = byCategory[currentCategory];
    
    if (categoryQuestions && categoryQuestions.length > 0) {
      const question = categoryQuestions.shift()!;
      queue.push(question);
    } else {
      categories.splice(categoryIndex % categories.length, 1);
      if (categories.length === 0) break;
    }
    
    categoryIndex++;
  }
  
  if (customQuestions.length > 0) {
    const interval = Math.floor(queue.length / (customQuestions.length + 1));
    customQuestions.forEach((text, i) => {
      const insertPosition = interval * (i + 1);
      queue.splice(insertPosition, 0, {
        textDe: text,
        textEn: text,
        category: 'CUSTOM',
        region: 'ALL',
      });
    });
  }
  
  return queue.slice(0, totalQuestions);
}

export function getCategoryLabel(category: QuestionCategory, locale: 'de' | 'en' = 'de'): string {
  return locale === 'de'
    ? QUESTION_CATEGORIES[category].labelDe
    : QUESTION_CATEGORIES[category].labelEn;
}

export function isRegionSpecificCategory(category: QuestionCategory): boolean {
  return category === 'DDR' || category === 'REUNIFICATION' || category === 'WAR_POSTWAR';
}
