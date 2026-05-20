import L from 'leaflet';

type PinColor = 'green' | 'amber' | 'red';

const COLOR_MAP: Record<PinColor, string> = {
  green: '#16a34a',
  amber: '#d97706',
  red: '#dc2626',
};

function buildSvgPin(fill: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
    <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="${fill}" stroke="white" stroke-width="1.5"/>
    <circle cx="12" cy="12" r="4" fill="white"/>
  </svg>`;
}

const iconCache = new Map<PinColor, L.DivIcon>();

export function getMapIcon(color: PinColor): L.DivIcon {
  if (iconCache.has(color)) return iconCache.get(color)!;

  const icon = L.divIcon({
    html: buildSvgPin(COLOR_MAP[color]),
    className: '',
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
  });

  iconCache.set(color, icon);
  return icon;
}
