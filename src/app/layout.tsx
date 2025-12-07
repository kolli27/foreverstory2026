import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'ForeverStory – Lebensgeschichten für die Ewigkeit',
    template: '%s | ForeverStory',
  },
  description:
    'Bewahren Sie die Geschichten Ihrer Liebsten. ForeverStory hilft Familien, Erinnerungen festzuhalten – eine Frage nach der anderen.',
  keywords: [
    'Lebensgeschichte',
    'Familiengeschichte',
    'Erinnerungen',
    'Geschenk',
    'Großeltern',
    'Biografie',
    'Familienbuch',
  ],
  authors: [{ name: 'ForeverStory' }],
  creator: 'ForeverStory',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://foreverstory.de'
  ),
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    siteName: 'ForeverStory',
    title: 'ForeverStory – Lebensgeschichten für die Ewigkeit',
    description:
      'Bewahren Sie die Geschichten Ihrer Liebsten. Das perfekte Geschenk für Eltern und Großeltern.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ForeverStory – Lebensgeschichten für die Ewigkeit',
    description:
      'Bewahren Sie die Geschichten Ihrer Liebsten. Das perfekte Geschenk für Eltern und Großeltern.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
      </head>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-emerald-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Zum Hauptinhalt springen
        </a>
        {children}
      </body>
    </html>
  );
}
