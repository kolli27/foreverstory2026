/**
 * Current Question Card Component
 * Displays the current week's question with prominent CTA
 */

import Link from 'next/link';
import { DashboardQuestion } from '@/lib/dashboard';
import { QuestionCategory } from '@prisma/client';

interface CurrentQuestionCardProps {
  question: DashboardQuestion | null;
}

const CATEGORY_LABELS: Record<QuestionCategory, string> = {
  CHILDHOOD: 'Kindheit',
  EDUCATION: 'Ausbildung',
  CAREER: 'Beruf',
  FAMILY: 'Familie',
  RELATIONSHIPS: 'Beziehungen',
  WAR_POSTWAR: 'Krieg und Nachkriegszeit',
  DDR: 'DDR-Erinnerungen',
  REUNIFICATION: 'Wiedervereinigung',
  TRADITIONS: 'Traditionen',
  LIFE_LESSONS: 'Lebenserfahrung',
  CUSTOM: 'Ihre Frage',
};

const CATEGORY_COLORS: Record<QuestionCategory, string> = {
  CHILDHOOD: 'bg-pink-100 text-pink-800',
  EDUCATION: 'bg-purple-100 text-purple-800',
  CAREER: 'bg-blue-100 text-blue-800',
  FAMILY: 'bg-green-100 text-green-800',
  RELATIONSHIPS: 'bg-rose-100 text-rose-800',
  WAR_POSTWAR: 'bg-gray-100 text-gray-800',
  DDR: 'bg-red-100 text-red-800',
  REUNIFICATION: 'bg-orange-100 text-orange-800',
  TRADITIONS: 'bg-amber-100 text-amber-800',
  LIFE_LESSONS: 'bg-indigo-100 text-indigo-800',
  CUSTOM: 'bg-cyan-100 text-cyan-800',
};

export function CurrentQuestionCard({ question }: CurrentQuestionCardProps) {
  if (!question) {
    // All questions answered
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200 p-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <h2 className="mb-3 text-2xl font-bold text-gray-900">
            Glückwunsch! Sie haben alle Fragen beantwortet.
          </h2>

          <p className="mb-6 text-base text-gray-700">
            Sie haben großartige Arbeit geleistet. Ihre Geschichten sind bereit für Ihr Buch.
          </p>

          <Link
            href="/stories"
            className="inline-flex items-center justify-center rounded-lg bg-green-600 px-8 py-4 text-lg font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors min-h-[56px]"
          >
            Alle Geschichten ansehen
          </Link>
        </div>
      </div>
    );
  }

  const categoryLabel = CATEGORY_LABELS[question.category];
  const categoryColor = CATEGORY_COLORS[question.category];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Ihre Frage diese Woche
          </h2>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${categoryColor}`}
          >
            {categoryLabel}
          </span>
        </div>

        {/* Question Text */}
        <div className="mb-8">
          <p className="text-2xl font-medium text-gray-900 leading-relaxed">
            {question.textDe}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/write"
            className="flex-1 inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors min-h-[56px]"
          >
            Jetzt beantworten
          </Link>

          <button
            type="button"
            className="sm:flex-initial inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-6 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors min-h-[56px]"
          >
            Frage überspringen
          </button>
        </div>
      </div>
    </div>
  );
}
