import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Datenschutzerklärung | PropFlow' };

export default function DatenschutzPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold">Datenschutzerklärung</h1>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">1. Verantwortlicher</h2>
        <p className="text-sm text-muted-foreground">
          PropFlow, Musterstraße 1, 10115 Berlin<br />
          E-Mail: <a href="mailto:privacy@propflow.dev" className="text-primary underline">privacy@propflow.dev</a>
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">2. Erhobene Daten</h2>
        <p className="text-sm text-muted-foreground">
          Wir verarbeiten folgende personenbezogene Daten: Name, E-Mail-Adresse, Telefonnummer (optional),
          Ticketinhalte (Wartungsmeldungen), hochgeladene Fotos sowie technische Zugriffsdaten (IP-Adresse, Browser).
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">3. Zweck der Verarbeitung</h2>
        <p className="text-sm text-muted-foreground">
          Die Daten werden ausschließlich zur Erbringung des Immobilienverwaltungsdienstes PropFlow verwendet —
          insbesondere zur Verwaltung von Wartungstickets, Kommunikation zwischen Vermieter und Mieter sowie
          Terminplanung.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">4. Rechtsgrundlage</h2>
        <p className="text-sm text-muted-foreground">
          Die Verarbeitung erfolgt auf Basis von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">5. Auftragsverarbeiter</h2>
        <ul className="mt-1 list-disc pl-5 text-sm text-muted-foreground">
          <li>NeonDB (Datenbankhosting, EU-Frankfurt)</li>
          <li>Resend (E-Mail-Versand, USA — mit EU-Standardvertragsklauseln)</li>
          <li>Cloudinary (Dateispeicherung, EU)</li>
          <li>Railway (Server-Hosting, EU)</li>
          <li>Vercel (Frontend-Hosting, EU-Frankfurt)</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">6. Speicherdauer</h2>
        <p className="text-sm text-muted-foreground">
          Daten werden für die Dauer des aktiven Kontos gespeichert sowie 6 Monate nach Kontolöschung,
          sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">7. Ihre Rechte</h2>
        <p className="text-sm text-muted-foreground">
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung sowie
          Datenübertragbarkeit. Kontakt für Datenschutzanfragen:{' '}
          <a href="mailto:privacy@propflow.dev" className="text-primary underline">privacy@propflow.dev</a>
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">8. Cookies</h2>
        <p className="text-sm text-muted-foreground">
          PropFlow verwendet ausschließlich technisch notwendige Cookies für Authentifizierung und Sitzungsverwaltung.
          Es werden keine Tracking- oder Werbe-Cookies eingesetzt.
        </p>
      </section>

      <p className="mt-8 text-xs text-muted-foreground">
        <Link href="/impressum" className="underline">Impressum</Link>
        {' · '}
        <Link href="/terms" className="underline">AGB</Link>
      </p>
    </div>
  );
}
