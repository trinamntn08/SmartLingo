import { Image } from 'react-native';
import { colors } from './theme';

const iconPaths = {
  book: 'M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1m0-15c3-2 6-2 10-1v15c-4-1-7-1-10 1V5',
  calendar: 'M3 6h18v15H3zM3 10h18M8 3v5m8-5v5m-8 6h2m4 0h2m-8 3h2',
  bookmark: 'M6 3h12v18l-6-4-6 4z',
  headphones: 'M4 14v-2a8 8 0 0 1 16 0v2M4 13h3v6H5a1 1 0 0 1-1-1v-5Zm16 0h-3v6h2a1 1 0 0 0 1-1v-5Z',
  mic: 'M9 9V5a3 3 0 0 1 6 0v4a3 3 0 0 1-6 0Zm-3 0v1a6 6 0 0 0 12 0V9m-6 7v4m-3 1h6',
  chart: 'M4 4v16h16M8 16v-4m5 4V7m5 9V9',
  settings: 'M4 6h16M4 12h16M4 18h16M8 4v4m8 2v4m-6 2v4',
  chevron: 'm9 6 6 6-6 6',
  'chevron-down': 'm6 9 6 6 6-6',
  folder: 'M3 7V5h7l2 2h9v13H3z',
  layers: 'm12 3 9 5-9 5-9-5 9-5Zm9 9-9 5-9-5m18 4-9 5-9-5',
  grid: 'M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z',
  search: 'M15.8 15.8 21 21m-3-9a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z',
  'arrow-right': 'M4 12h15m-6-6 6 6-6 6',
  'arrow-left': 'M20 12H5m6-6-6 6 6 6',
  play: 'm9 5 12 7-12 7z',
  speaker: 'M3 9h4l5-4v14l-5-4H3zM16 8q4 4 0 8m3-11q7 7 0 14',
  stop: 'M6 6h12v12H6z',
  check: 'm5 12 4 4L19 6',
  offline: 'M5 17v3h14v-3M12 4v12m-4-4 4 4 4-4',
  globe: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-18 0h18m-9-9c-4 4-4 14 0 18 4-4 4-14 0-18Z',
  layout: 'M3 5h18v14H3zm0 4h18m-12 0v10',
  menu: 'M4 6h16M4 12h16M4 18h16',
  edit: 'm14 6 4 4m-13 9 4-1L20 7l-4-4L5 14z',
  home: 'm3 10 9-7 9 7m-2-1v12H5V9m4 12v-7h6v7',
  review: 'M4 8a9 9 0 1 1-1 7M4 3v5h5',
  person: 'M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2',
  image: 'M3 5h18v14H3zM3 16l5-5 4 4 4-3 5 4m-4-7h.01',
} as const;

export type IconName = keyof typeof iconPaths;

export function Icon({ name, size = 20, color = colors.ink }: { name: IconName; size?: number; color?: string }) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="${iconPaths[name]}" stroke="${color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  return <Image accessible={false} aria-hidden source={{ uri: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` }}
    style={{ width: size, height: size, flexShrink: 0 }} />;
}
