import type { ContextPhoto } from './contextPhotos';

const bistro: ContextPhoto = {
  uri: '/learning-scenes/french-bistro-dialogue.jpg',
  alt: 'A server talking with a customer at a French bistro table',
};
const neighbours: ContextPhoto = {
  uri: '/learning-scenes/french-neighbour-dialogue.jpg',
  alt: 'Two neighbours greeting each other at an apartment entrance',
};
const workshop: ContextPhoto = {
  uri: '/learning-scenes/french-workshop-dialogue.jpg',
  alt: 'Adults speaking at a neighbourhood workshop reception',
};

export function getLessonDialoguePhoto(lessonId: string): ContextPhoto | undefined {
  if (lessonId.startsWith('fr.restaurant.')) return bistro;
  if (lessonId.startsWith('fr.greetings.')) return neighbours;
  return undefined;
}

export function getDailyDialoguePhoto(dayId: string): ContextPhoto | undefined {
  switch (dayId) {
    case 'fr.open-course-pilot.day-1': return neighbours;
    case 'fr.open-course-pilot.day-2':
    case 'fr.open-course-pilot.day-3':
    case 'fr.open-course-pilot.day-4':
    case 'fr.open-course-pilot.day-5': return workshop;
    default: return undefined;
  }
}
