/**
 * Progress Indicator Component
 * Shows user's story completion progress
 */

import { DashboardProgress } from '@/lib/dashboard';

interface ProgressIndicatorProps {
  progress: DashboardProgress;
}

export function ProgressIndicator({ progress }: ProgressIndicatorProps) {
  const { answeredCount, totalQuestions, percentComplete } = progress;

  // Encouragement messages based on progress
  const getEncouragementMessage = (percent: number): string | null => {
    if (percent === 0) return null;
    if (percent >= 100) return 'Alle Fragen beantwortet! 🎉';
    if (percent >= 75) return 'Fast geschafft!';
    if (percent >= 50) return 'Halbzeit! Weiter so!';
    if (percent >= 25) return 'Ein guter Anfang!';
    return null;
  };

  const encouragement = getEncouragementMessage(percentComplete);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="space-y-3">
        {/* Heading */}
        <h2 className="text-lg font-semibold text-gray-900">
          Ihr Fortschritt
        </h2>

        {/* Progress text */}
        <div className="flex items-baseline justify-between">
          <p className="text-base text-gray-700">
            <span className="font-semibold text-xl text-gray-900">
              {answeredCount}
            </span>
            {' '}von{' '}
            <span className="font-semibold text-xl text-gray-900">
              {totalQuestions}
            </span>
            {' '}Fragen beantwortet
          </p>
          <p className="text-sm text-gray-500 tabular-nums">
            {percentComplete}%
          </p>
        </div>

        {/* Progress bar */}
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${percentComplete}%` }}
            role="progressbar"
            aria-valuenow={percentComplete}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${answeredCount} von ${totalQuestions} Fragen beantwortet`}
          />
        </div>

        {/* Encouragement message */}
        {encouragement && (
          <p className="text-sm font-medium text-blue-700">
            {encouragement}
          </p>
        )}
      </div>
    </div>
  );
}
