import Link from 'next/link';

export function LegalFooter() {
  return (
    <footer className="border-t px-4 py-3 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} PropFlow
      {' · '}
      <Link href="/impressum" className="hover:underline">Impressum</Link>
      {' · '}
      <Link href="/datenschutz" className="hover:underline">Datenschutz</Link>
      {' · '}
      <Link href="/terms" className="hover:underline">AGB</Link>
    </footer>
  );
}
