'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import type { PropertyMapPoint } from '@/lib/api/types';

const PropertyMapInner = dynamic(
  () => import('./property-map-inner').then((m) => m.PropertyMapInner),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full rounded-lg" />,
  },
);

interface Props {
  points: PropertyMapPoint[];
  className?: string;
}

export function PropertyMap({ points, className }: Props) {
  return (
    <div className={className ?? 'h-[500px] w-full'}>
      <PropertyMapInner points={points} />
    </div>
  );
}
