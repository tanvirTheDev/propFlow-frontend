import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Impressum | PropFlow' };

export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold">Impressum</h1>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Angaben gemäß § 5 TMG</h2>
        <p>PropFlow</p>
        <p>Musterstraße 1</p>
        <p>10115 Berlin, Deutschland</p>
        <p className="mt-2">E-Mail: <a href="mailto:hello@propflow.dev" className="text-primary underline">hello@propflow.dev</a></p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
        <p>PropFlow GmbH, Musterstraße 1, 10115 Berlin</p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Streitschlichtung / Dispute Resolution</h2>
        <p className="text-sm text-muted-foreground">
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit:{' '}
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
            https://ec.europa.eu/consumers/odr/
          </a>
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">Haftungsausschluss</h2>
        <p className="text-sm text-muted-foreground">
          Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität
          der Inhalte können wir jedoch keine Gewähr übernehmen.
        </p>
      </section>

      <p className="mt-8 text-xs text-muted-foreground">
        <Link href="/datenschutz" className="underline">Datenschutzerklärung</Link>
        {' · '}
        <Link href="/terms" className="underline">AGB</Link>
      </p>
    </div>
  );
}
