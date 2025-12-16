/**
 * Recent Story Card Component
 * Shows preview of a single story
 */

import Link from 'next/link';
import { DashboardStory } from '@/lib/dashboard';

interface RecentStoryCardProps {
  story: DashboardStory;
}

/**
 * Format date in German format (DD. Month YYYY)
 */
function formatGermanDate(date: Date): string {
  const months = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day}. ${month} ${year}`;
}

export function RecentStoryCard({ story }: RecentStoryCardProps) {
  const {
    id,
    questionText,
    createdAt,
    wordCount,
    hasAudio,
    hasPhotos,
    status,
  } = story;

  const isDraft = status === 'DRAFT';

  return (
    <div className="group rounded-lg border border-gray-200 bg-white p-5 hover:border-blue-300 hover:shadow-sm transition-all">
      <div className="space-y-3">
        {/* Question text */}
        <h3 className="text-base font-medium text-gray-900 line-clamp-2 leading-snug">
          {questionText}
        </h3>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
          <time dateTime={createdAt.toISOString()} className="tabular-nums">
            {formatGermanDate(createdAt)}
          </time>

          {wordCount > 0 && (
            <span className="flex items-center gap-1">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="tabular-nums">{wordCount} Wörter</span>
            </span>
          )}

          {hasAudio && (
            <span className="flex items-center gap-1 text-blue-600">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
              <span>Mit Aufnahme</span>
            </span>
          )}

          {hasPhotos && (
            <span className="flex items-center gap-1">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Mit Fotos</span>
            </span>
          )}

          {isDraft && (
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
              Entwurf
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Link
            href={`/write?storyId=${id}`}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1 min-h-[32px]"
          >
            {isDraft ? 'Weiter bearbeiten' : 'Ansehen'}
          </Link>
        </div>
      </div>
    </div>
  );
}
