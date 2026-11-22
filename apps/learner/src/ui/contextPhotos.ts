import type { TargetLanguage } from '@smartlingo/domain';

export interface ContextPhoto {
  uri: string;
  alt: string;
}

const frenchStreet: ContextPhoto = {
  uri: '/learning-scenes/french-street.jpg',
  alt: 'Illustrative photograph of a French neighbourhood bakery and café',
};
const japaneseStreet: ContextPhoto = {
  uri: '/learning-scenes/japanese-street.jpg',
  alt: 'Illustrative photograph of a Japanese neighbourhood shopping street',
};
const japaneseMarket: ContextPhoto = {
  uri: '/learning-scenes/japanese-market.jpg',
  alt: 'Illustrative photograph of a shopkeeper at a Japanese produce counter',
};
const japaneseStation: ContextPhoto = {
  uri: '/learning-scenes/japanese-station.jpg',
  alt: 'Illustrative photograph of a commuter train at a Japanese station',
};

/** Contextual presentation media is independent of word and quiz bindings. */
export function getContextPhoto(language: TargetLanguage, topic?: string): ContextPhoto {
  if (language === 'fr-FR') return frenchStreet;
  if (topic === 'Buy a few things') return japaneseMarket;
  if (topic === 'Find the station and check the time') return japaneseStation;
  return japaneseStreet;
}
