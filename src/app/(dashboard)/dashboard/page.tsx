/**
 * Story Author Dashboard Page
 * Main dashboard for authenticated story authors
 */

import { requireAuth } from '@/lib/auth/get-session';
import { getDashboardData } from '@/lib/dashboard';
import { CurrentQuestionCard } from '@/components/dashboard/current-question-card';
import { ProgressIndicator } from '@/components/dashboard/progress-indicator';
import { RecentStoriesList } from '@/components/dashboard/recent-stories-list';
import { SubscriptionBanner } from '@/components/dashboard/subscription-banner';
import { EmptyState } from '@/components/dashboard/empty-state';

export default async function DashboardPage() {
  // Require authentication
  const user = await requireAuth();

  // Fetch all dashboard data
  const data = await getDashboardData(user.id);

  // If no active subscription, show empty state
  if (!data.subscription) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      {/* Subscription Banner */}
      <SubscriptionBanner subscription={data.subscription} />

      {/* Current Question Card (Hero) */}
      <CurrentQuestionCard question={data.currentQuestion} />

      {/* Progress Indicator */}
      <ProgressIndicator progress={data.progress} />

      {/* Recent Stories */}
      <RecentStoriesList stories={data.recentStories} />
    </div>
  );
}
