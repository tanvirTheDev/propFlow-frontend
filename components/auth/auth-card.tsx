import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/shared/logo';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { cn } from '@/lib/utils/cn';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ title, subtitle, children, className }: AuthCardProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-secondary/30 px-4 py-12">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className={cn('w-full max-w-md', className)}>
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
            {subtitle && (
              <CardDescription className="text-center text-sm">{subtitle}</CardDescription>
            )}
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}
