'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { LatLngBoundsExpression } from 'leaflet';
import Link from 'next/link';
import { fixLeafletIcons } from '@/lib/utils/leaflet-icon-fix';
import { getMapIcon } from '@/lib/utils/map-icons';
import type { PropertyMapPoint } from '@/lib/api/types';

fixLeafletIcons();

function BoundsController({ points }: { points: PropertyMapPoint[] }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;
    const bounds: LatLngBoundsExpression = points.map((p) => [p.latitude, p.longitude]);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, points]);

  return null;
}

interface Props {
  points: PropertyMapPoint[];
}

export function PropertyMapInner({ points }: Props) {
  return (
    <MapContainer
      center={[51.1657, 10.4515]}
      zoom={6}
      className="h-full w-full rounded-lg"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.map((p) => (
        <Marker key={p.id} position={[p.latitude, p.longitude]} icon={getMapIcon(p.pinColor)}>
          <Popup>
            <div className="min-w-[180px]">
              <p className="font-semibold">{p.name}</p>
              <p className="text-xs text-gray-500">
                {p.street}, {p.postalCode} {p.city}
              </p>
              <p className="mt-1 text-xs">
                {p.occupiedUnits}/{p.totalUnits} units occupied
              </p>
              <Link
                href={`/landlord/properties/${p.id}`}
                className="mt-2 block text-xs font-medium text-blue-600 hover:underline"
              >
                View property →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
      {points.length > 0 && <BoundsController points={points} />}
    </MapContainer>
  );
}
