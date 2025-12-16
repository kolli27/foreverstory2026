/**
 * Subscription Banner Component
 * Shows subscription status and days remaining
 */

import { DashboardSubscription } from '@/lib/dashboard';
import { SubscriptionPlan } from '@prisma/client';

interface SubscriptionBannerProps {
  subscription: DashboardSubscription;
}

const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  STARTER: 'Basis-Abo',
  STANDARD: 'Standard-Abo',
  PREMIUM: 'Premium-Abo',
};

export function SubscriptionBanner({ subscription }: SubscriptionBannerProps) {
  const { plan, daysRemaining } = subscription;
  const planLabel = PLAN_LABELS[plan];

  // Show warning if less than 14 days remaining
  const isEndingSoon = daysRemaining !== null && daysRemaining < 14;

  if (daysRemaining === null) {
    // No end date (shouldn't happen, but handle gracefully)
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">{planLabel}</span> aktiv
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border p-4 ${
        isEndingSoon
          ? 'bg-amber-50 border-amber-200'
          : 'bg-blue-50 border-blue-200'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className={`text-sm ${isEndingSoon ? 'text-amber-900' : 'text-blue-900'}`}>
            <span className="font-semibold">{planLabel}</span>
            {' · '}
            <span className="tabular-nums">
              Noch {daysRemaining} {daysRemaining === 1 ? 'Tag' : 'Tage'} verbleibend
            </span>
          </p>
          {isEndingSoon && (
            <p className="mt-1 text-sm text-amber-800">
              Ihr Abo läuft bald ab. Möchten Sie verlängern?
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
