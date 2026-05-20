import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <span className="text-6xl font-black text-primary">404</span>
      <h2 className="text-2xl font-bold">Seite nicht gefunden</h2>
      <p className="text-muted-foreground">
        Die Seite, die du suchst, existiert nicht oder wurde verschoben.
      </p>
      <Button asChild>
        <Link href="/">Zurück zur Startseite</Link>
      </Button>
    </div>
  );
}
