import type { Lesson } from '@smartlingo/domain';
import { buildTopic } from './build-topic';
import { frenchSeedLessons } from './topics/preview-lessons';
import { foodHomeTopics } from './topics/food-home';
import { dailyLifeTopics } from './topics/daily-life';
import { reuseSharedVocabulary } from './shared-vocabulary';
import { orderCourseLessons } from './course-sequence';
import { buildGreetingsLessons } from './topics/greetings';
import { foundationTopics } from './topics/foundations';
import { communicationTopics } from './topics/communication';
import { foodTravelTopics } from './topics/food-travel';
import { studyWorkTopics } from './topics/study-work';
import { experienceTopics } from './topics/experiences';
import { buildOpenCoursePilot } from './open-course-pilot';

export { getWordVisual, wordVisuals, type WordVisual } from './visuals';
export { getVocabularyPhoto } from './photos';
export { previousSeedFingerprints } from './seed-baselines';
export { courseSequence, orderCourseLessons } from './course-sequence';
export { frenchCoursePractice } from './daily-course-practice';
export { kanaScripts, japaneseAlphabetLessons, japaneseAlphabetNotes,
  type KanaScript, type KanaCharacter, type JapaneseAlphabetLesson } from './japanese-alphabet';

const existingLessons: Lesson[] = reuseSharedVocabulary([
  ...frenchSeedLessons,
  ...foodHomeTopics.flatMap(topic => buildTopic({ ...topic, revision: 3 })),
  ...dailyLifeTopics.flatMap(topic => buildTopic({ ...topic, revision: 3 })),
  ...foundationTopics.flatMap(buildTopic),
  ...foodTravelTopics.flatMap(buildTopic),
  ...studyWorkTopics.flatMap(buildTopic),
  ...communicationTopics.flatMap(buildTopic),
  ...experienceTopics.flatMap(buildTopic),
]);
export const lessons: Lesson[] = orderCourseLessons([
  ...buildGreetingsLessons(existingLessons.flatMap(lesson => lesson.vocabulary)),
  ...existingLessons,
]);
export const restaurantLesson = lessons.find(lesson => lesson.id === 'fr.restaurant.customer')!;
export const openCoursePilot = buildOpenCoursePilot(lessons.flatMap(lesson => lesson.vocabulary));
export { japaneseCourse } from './japanese-course';
export { japaneseLessons } from './japanese-lessons';
