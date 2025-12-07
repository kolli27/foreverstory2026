'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import { PLANS, formatPrice, getMonthlyPrice } from '@/lib/pricing';

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <HeroSection />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-emerald-600">ForeverStory</span>
        </Link>
        <nav className="hidden items-center space-x-8 md:flex">
          <Link
            href="#so-funktioniert-es"
            className="text-base text-slate-600 hover:text-slate-900"
          >
            So funktioniert es
          </Link>
          <Link
            href="#preise"
            className="text-base text-slate-600 hover:text-slate-900"
          >
            Preise
          </Link>
          <Link
            href="/anmelden"
            className="text-base text-slate-600 hover:text-slate-900"
          >
            Anmelden
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="primary" size="default" asChild>
            <Link href="/schenken">Jetzt verschenken</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Bewahren Sie die Geschichten,{' '}
            <span className="text-emerald-600">die am wichtigsten sind</span>
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-slate-600">
            Bevor sie für immer verloren gehen. ForeverStory hilft Ihren Liebsten, 
            ihre Lebensgeschichte zu erzählen – eine Frage nach der anderen. 
            Das perfekte Geschenk für Eltern und Großeltern.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button variant="primary" size="xl" asChild>
              <Link href="/schenken">Jetzt verschenken</Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link href="#so-funktioniert-es">Mehr erfahren</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Ab 49 € • Keine Verpflichtung • Wunderschönes gedrucktes Buch
          </p>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-40 right-0 -z-10 h-96 w-96 rounded-full bg-emerald-100 opacity-50 blur-3xl" />
      <div className="absolute -bottom-40 left-0 -z-10 h-96 w-96 rounded-full bg-amber-100 opacity-50 blur-3xl" />
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      number: '1',
      title: 'Verschenken Sie ForeverStory',
      description:
        'Wählen Sie ein Paket und personalisieren Sie Ihr Geschenk mit einer persönlichen Nachricht.',
      icon: '🎁',
    },
    {
      number: '2',
      title: 'Wöchentliche Fragen',
      description:
        'Ihr Familienmitglied erhält jede Woche eine liebevoll ausgewählte Frage per E-Mail.',
      icon: '✉️',
    },
    {
      number: '3',
      title: 'Geschichten aufnehmen',
      description:
        'Die Antworten können geschrieben oder als Sprachnachricht aufgenommen werden.',
      icon: '🎙️',
    },
    {
      number: '4',
      title: 'Gedrucktes Buch',
      description:
        'Am Ende wird ein wunderschönes, gebundenes Buch mit allen Geschichten erstellt.',
      icon: '📚',
    },
  ];

  return (
    <section id="so-funktioniert-es" className="bg-white py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            So funktioniert es
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            In vier einfachen Schritten zur Lebensgeschichte
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-2xl bg-slate-50 p-8 text-center"
            >
              <div className="mb-4 text-4xl">{step.icon}</div>
              <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                {step.number}
              </div>
              <h3 className="mb-3 text-xl font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="text-base text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const plans = Object.values(PLANS);

  return (
    <section id="preise" className="bg-slate-50 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Wählen Sie das passende Paket
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Jedes Paket enthält wöchentliche Fragen, Sprachaufnahme und Familienteilen
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl bg-white p-8 shadow-sm ring-1 ${
                plan.popular
                  ? 'ring-2 ring-emerald-600'
                  : 'ring-slate-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-1 text-sm font-medium text-white">
                    Beliebt
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-xl font-semibold text-slate-900">
                  {plan.name}
                </h3>
                <p className="mt-2 text-base text-slate-600">
                  {plan.durationMonths} Monate
                </p>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-slate-900">
                    {formatPrice(plan.priceEuroCents, 'de-DE')}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {formatPrice(getMonthlyPrice(plan.id), 'de-DE')} pro Monat
                </p>
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <svg
                      className="mr-3 h-5 w-5 flex-shrink-0 text-emerald-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-base text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  fullWidth
                  size="lg"
                  asChild
                >
                  <Link href={`/schenken?plan=${plan.id.toLowerCase()}`}>
                    Paket wählen
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        'Das Buch meiner Mutter ist unser größter Familienschatz geworden. Geschichten, die sonst verloren gegangen wären.',
      author: 'Sabine M.',
      location: 'München',
    },
    {
      quote:
        'Mein Vater (78) war erst skeptisch, aber nach der ersten Frage konnte er nicht mehr aufhören zu erzählen.',
      author: 'Thomas K.',
      location: 'Hamburg',
    },
    {
      quote:
        'Die Sprachaufnahme-Funktion war perfekt für meine Großmutter. Sie tippt nicht gerne, aber erzählen kann sie!',
      author: 'Julia S.',
      location: 'Berlin',
    },
  ];

  return (
    <section className="bg-white py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Was unsere Kunden sagen
          </h2>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-2xl bg-slate-50 p-8"
            >
              <div className="mb-4 text-emerald-600">
                <svg
                  className="h-8 w-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-lg text-slate-700">{testimonial.quote}</p>
              <div className="mt-6">
                <p className="font-semibold text-slate-900">
                  {testimonial.author}
                </p>
                <p className="text-sm text-slate-500">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="bg-emerald-600 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Schenken Sie Erinnerungen, die ein Leben lang bleiben
          </h2>
          <p className="mt-6 text-xl text-emerald-100">
            Starten Sie noch heute und helfen Sie Ihren Liebsten, ihre Geschichte zu erzählen.
          </p>
          <div className="mt-10">
            <Button
              variant="default"
              size="xl"
              className="bg-white text-emerald-600 hover:bg-emerald-50"
              asChild
            >
              <Link href="/schenken">Jetzt ForeverStory verschenken</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <span className="text-xl font-bold text-emerald-600">ForeverStory</span>
            <p className="mt-4 max-w-md text-base text-slate-600">
              Wir helfen Familien, die Geschichten ihrer Liebsten zu bewahren – 
              für die Ewigkeit.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">Produkt</h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="#so-funktioniert-es" className="text-slate-600 hover:text-slate-900">
                  So funktioniert es
                </Link>
              </li>
              <li>
                <Link href="#preise" className="text-slate-600 hover:text-slate-900">
                  Preise
                </Link>
              </li>
              <li>
                <Link href="/beispiel" className="text-slate-600 hover:text-slate-900">
                  Beispielbuch
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">Rechtliches</h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/impressum" className="text-slate-600 hover:text-slate-900">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-slate-600 hover:text-slate-900">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/agb" className="text-slate-600 hover:text-slate-900">
                  AGB
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-200 pt-8">
          <p className="text-center text-sm text-slate-500">
            © {currentYear} ForeverStory. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}
