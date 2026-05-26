'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import type { PropertyMapPoint } from '@/lib/api/types';

const PropertyMapInner = dynamic(
  () => import('./property-map-inner').then((m) => m.PropertyMapInner),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full rounded-2xl" />,
  },
);

interface Props {
  points: PropertyMapPoint[];
  className?: string;
}

export function PropertyMap({ points, className }: Props) {
  return (
    /* The outer div carries className (which may include h-full flex-1 etc.) */
    <div className={className ?? 'h-125 w-full'}>
      {/* PropertyMapInner always fills its parent */}
      <PropertyMapInner points={points} />
    </div>
  );
}
