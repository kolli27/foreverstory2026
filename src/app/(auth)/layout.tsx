import type { Metadata } from 'next';

/**
 * Auth Layout
 * Centered, simple design for authentication pages
 *
 * Features:
 * - ForeverStory branding
 * - High contrast mode support
 * - Responsive design
 * - Accessibility-first
 */

export const metadata: Metadata = {
  title: {
    template: '%s | ForeverStory',
    default: 'Anmelden | ForeverStory',
  },
  description:
    'Melden Sie sich bei ForeverStory an, um Ihre Familiengeschichten zu bewahren.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Main container - centered and constrained */}
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        {/* Logo/Brand */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900">
            ForeverStory
          </h1>
          <p className="mt-2 text-base text-slate-600">
            Familiengeschichten bewahren
          </p>
        </div>

        {/* Content card */}
        <div className="w-full max-w-md">
          <div className="rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-lg">
            {children}
          </div>
        </div>

        {/* Footer links */}
        <footer className="mt-8 text-center">
          <nav className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
            <a
              href="/datenschutz"
              className="hover:text-slate-900 hover:underline"
            >
              Datenschutzerklärung
            </a>
            <span className="text-slate-400">•</span>
            <a
              href="/impressum"
              className="hover:text-slate-900 hover:underline"
            >
              Impressum
            </a>
            <span className="text-slate-400">•</span>
            <a
              href="/hilfe"
              className="hover:text-slate-900 hover:underline"
            >
              Hilfe
            </a>
          </nav>
          <p className="mt-4 text-xs text-slate-500">
            © {new Date().getFullYear()} ForeverStory. Alle Rechte vorbehalten.
          </p>
        </footer>
      </div>
    </div>
  );
}
