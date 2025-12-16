/**
 * Recent Stories List Component
 * Container for displaying recent stories
 */

import Link from 'next/link';
import { DashboardStory } from '@/lib/dashboard';
import { RecentStoryCard } from './recent-story-card';

interface RecentStoriesListProps {
  stories: DashboardStory[];
}

export function RecentStoriesList({ stories }: RecentStoriesListProps) {
  if (stories.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-base font-medium text-gray-900">
            Noch keine Geschichten
          </h3>
          <p className="mb-4 text-sm text-gray-600">
            Sie haben noch keine Geschichten verfasst. Beantworten Sie Ihre erste Frage!
          </p>
          <Link
            href="/write"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors min-h-[48px]"
          >
            Erste Geschichte schreiben
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="space-y-4">
        {/* Heading */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Ihre letzten Geschichten
          </h2>
          <Link
            href="/stories"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
          >
            Alle ansehen →
          </Link>
        </div>

        {/* Story cards */}
        <div className="space-y-3">
          {stories.map((story) => (
            <RecentStoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </div>
  );
}
