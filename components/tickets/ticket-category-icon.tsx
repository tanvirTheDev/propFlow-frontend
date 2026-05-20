import { Droplets, Flame, Wifi, Brush, Volume2, Zap, HelpCircle } from 'lucide-react';
import type { TicketCategory } from '@/lib/api/types';

const icons: Record<TicketCategory, React.ElementType> = {
  PLUMBING: Droplets,
  HEATING: Flame,
  INTERNET: Wifi,
  CLEANING: Brush,
  NOISE: Volume2,
  ELECTRICITY: Zap,
  OTHER: HelpCircle,
};

export function TicketCategoryIcon({
  category,
  className,
}: {
  category: TicketCategory;
  className?: string;
}) {
  const Icon = icons[category];
  return <Icon className={className ?? 'h-5 w-5'} />;
}
