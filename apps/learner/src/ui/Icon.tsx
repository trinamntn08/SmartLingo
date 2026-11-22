import { Image } from 'react-native';
import { colors } from './theme';

const paths = {
  brand: 'M3 11.5a7 7 0 0 1 7-7h3a7 7 0 0 1 0 14H9l-4 3v-5a7 7 0 0 1-2-5z M8 11.5h.01m3.5 0h.01m3.5 0h.01',
  home: 'm3 10 9-7 9 7v9a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2z',
  explore: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z m3.5 5.5-2 5-5 2 2-5z',
  practice: 'M6 6h12a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3h-5l-4 3v-3H6a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3z M8 11.5h.01m4 0h.01m4 0h.01',
  review: 'M5 5a2 2 0 0 1 2-2h12v18H7a2 2 0 0 1 0-4h12M9 7h6m-6 4h6',
  profile: 'M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0z M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2',
  topics: 'M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z',
  book: 'M12 6v15M3 4h4a5 5 0 0 1 5 2 5 5 0 0 1 5-2h4v14h-4a5 5 0 0 0-5 3 5 5 0 0 0-5-3H3z',
  numbers: 'M5 9h14M5 15h14M11 4 8 20M16 4l-3 16',
  arrow: 'M4 12h15m-6-6 6 6-6 6',
  chevron: 'm9 6 6 6-6 6',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7v5l3 2',
  close: 'm6 6 12 12M18 6 6 18',
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, size = 20, color = colors.ink }: { name: IconName; size?: number; color?: string }) {
  const drawing = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${paths[name]}" fill="none" stroke="${color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  return <Image accessible={false} aria-hidden source={{ uri: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(drawing)}` }} style={{ width: size, height: size, flexShrink: 0 }} />;
}
