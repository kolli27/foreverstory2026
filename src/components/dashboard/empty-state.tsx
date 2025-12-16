/**
 * Empty State Component
 * Shown when user has no active subscription
 */

export function EmptyState() {
  return (
    <div className="flex min-h-[400px] items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="mb-6">
          <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              className="h-12 w-12 text-gray-400"
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
        </div>

        <h2 className="mb-3 text-2xl font-semibold text-gray-900">
          Kein aktives Abonnement
        </h2>

        <p className="mb-6 text-base text-gray-600 leading-relaxed">
          Sie haben derzeit kein aktives Story-Abonnement. Kontaktieren Sie die Person,
          die Ihnen dieses Geschenk gemacht hat, oder beginnen Sie selbst ein Abonnement.
        </p>

        <a
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors min-h-[48px]"
        >
          Mehr erfahren
        </a>
      </div>
    </div>
  );
}
