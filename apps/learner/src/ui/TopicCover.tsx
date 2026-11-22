import { useState } from 'react';
import { Image, View } from 'react-native';
import { getVocabularyPhoto } from '@smartlingo/content';
import type { LessonTopic } from '@smartlingo/domain';
import { colors } from './theme';

const featuredWords = new Map([
  ['Restaurant', 'fr.restaurant.book-table'],
  ['Bakery', 'fr.bakery.country-loaf'],
]);

/** Decorative topic media never participates in vocabulary or practice bindings. */
export function TopicCover({ topic, hero = false }: { topic: LessonTopic; hero?: boolean }) {
  const [failedUri, setFailedUri] = useState<string | null>(null);
  const candidates = topic.lessons[0]?.language === 'ja-JP' ? [] : topic.vocabulary
    .map(entry => ({ id: entry.id, photo: getVocabularyPhoto(entry.id, entry.target) }));
  const featuredId = featuredWords.get(topic.name);
  const photo = candidates.find(candidate => candidate.id === featuredId)?.photo
    ?? candidates.find(candidate => candidate.photo?.kind === 'context')?.photo
    ?? candidates.find(candidate => candidate.photo)?.photo;
  const uri = photo?.uri;
  return <View style={{ width: '100%', aspectRatio: hero ? 2.3 : 16 / 9, minHeight: hero ? 136 : undefined, maxHeight: hero ? 240 : undefined,
    backgroundColor: colors.green, overflow: 'hidden' }}>
    {uri && failedUri !== uri ? <Image accessibilityLabel={`Topic context: ${photo.alt}`}
      source={{ uri }} resizeMode="cover" onError={() => setFailedUri(uri)} style={{ width: '100%', height: '100%' }} />
      : <Image accessibilityLabel="Original illustration of an open study book"
        source={{ uri: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(bookArtwork(topic.name))}` }}
        style={{ width: '100%', height: '100%' }} resizeMode="cover" />}
  </View>;
}

// Original SmartLingo category artwork, drawn in code for this pilot (2026-11-22).
// A study-book visual, not a claim to depict a Japanese word or cultural setting.
function bookArtwork(name: string): string {
  const palettes = ['#E5EBDD', '#EAE3EE', '#F6E8CE', '#DFEAF0'];
  const tint = palettes[Array.from(name).reduce((sum, letter) => sum + letter.charCodeAt(0), 0) % palettes.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
    <rect width="640" height="360" fill="${tint}"/><circle cx="530" cy="60" r="110" fill="#FFFFFF" opacity=".35"/>
    <circle cx="85" cy="315" r="100" fill="#FFFFFF" opacity=".3"/>
    <ellipse cx="320" cy="286" rx="182" ry="18" fill="#4F1F2B" opacity=".08"/>
    <path d="M143 106 Q230 76 320 113 Q410 76 497 106 L497 267 Q410 241 320 279 Q230 241 143 267Z" fill="#4F1F2B"/>
    <path d="M153 94 Q232 67 316 104 L316 260 Q232 227 153 252Z" fill="#FFFCF5"/>
    <path d="M324 104 Q408 67 487 94 L487 252 Q408 227 324 260Z" fill="#FFF9EA"/>
    <path d="M178 130 Q229 115 286 135 M178 155 Q229 140 286 160 M178 180 Q229 165 267 180 M353 176 Q407 154 463 166 M353 202 Q407 180 463 192 M353 227 Q407 205 439 213" fill="none" stroke="#4F1F2B" stroke-width="6" stroke-linecap="round" opacity=".3"/>
    <rect x="355" y="112" width="65" height="40" rx="8" fill="#E5B84B" transform="rotate(-7 355 112)"/>
    <path d="M294 97 L306 101 L306 174 L295 163 L285 170 L285 95Z" fill="#C88B73"/>
    <path d="M505 215 L543 117 L555 122 L517 220 L505 229Z" fill="#4F1F2B"/>
  </svg>`;
}
