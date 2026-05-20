import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'AGB | PropFlow' };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold">Allgemeine Geschäftsbedingungen (AGB)</h1>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">1. Leistungsbeschreibung</h2>
        <p className="text-sm text-muted-foreground">
          PropFlow stellt eine webbasierte Plattform zur Verwaltung von Mietobjekten, Wartungstickets
          und Mieter-Vermieter-Kommunikation bereit. Der Dienst richtet sich an gewerbliche Vermieter in Deutschland.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">2. Nutzungsbedingungen</h2>
        <p className="text-sm text-muted-foreground">
          Der Nutzer verpflichtet sich, den Dienst ausschließlich für legale Zwecke zu nutzen und keine
          falschen oder irreführenden Angaben zu machen. Das Hochladen rechtswidriger Inhalte ist untersagt.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">3. Kontokündigung</h2>
        <p className="text-sm text-muted-foreground">
          Konten können jederzeit durch den Nutzer oder PropFlow gekündigt werden. Bei Kündigung werden
          die Daten gemäß Datenschutzerklärung gelöscht.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">4. Haftungsbeschränkung</h2>
        <p className="text-sm text-muted-foreground">
          PropFlow haftet nicht für mittelbare Schäden, Datenverluste durch höhere Gewalt oder Schäden
          infolge einer missbräuchlichen Nutzung durch Dritte. Die Haftung ist auf den tatsächlichen
          Vertragswert begrenzt.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold">5. Anwendbares Recht</h2>
        <p className="text-sm text-muted-foreground">
          Es gilt deutsches Recht. Gerichtsstand ist Berlin, Deutschland.
        </p>
      </section>

      <p className="mt-8 text-xs text-muted-foreground">
        <Link href="/impressum" className="underline">Impressum</Link>
        {' · '}
        <Link href="/datenschutz" className="underline">Datenschutz</Link>
      </p>
    </div>
  );
}
