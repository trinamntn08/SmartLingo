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
import { cyclingTopic } from './topics/cycling';
import { householdWasteTopic } from './topics/household-waste';
import { buildOpenCoursePilot } from './open-course-pilot';
import { everydayPractice } from './french-practice/everyday';
import { foundationPractice } from './french-practice/foundations';
import type { FrenchTransferTask } from './french-practice/types';

export type { FrenchTransferTask } from './french-practice/types';
export { getWordVisual, wordVisuals, type WordVisual } from './visuals';
export { getVocabularyPhoto } from './photos';
export { previousSeedFingerprints } from './seed-baselines';
export { courseSequence, orderCourseLessons } from './course-sequence';
export { frenchCoursePractice } from './daily-course-practice';
export { findSlangExpressions, slangCategories, slangCategoryIds, slangExpressions,
  type SlangCategory, type SlangExpression, type SlangRegister } from './slang';
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
  ...buildTopic(cyclingTopic),
  ...buildTopic(householdWasteTopic),
]);
export const lessons: Lesson[] = orderCourseLessons([
  ...buildGreetingsLessons(existingLessons.flatMap(lesson => lesson.vocabulary)),
  ...existingLessons,
]);
export const frenchTopicPractice: Readonly<Partial<Record<string, FrenchTransferTask>>> = {
  ...foundationPractice,
  ...everydayPractice,
};
const frenchDraftRevisions = new Map(lessons.map(lesson => [lesson.id, lesson.revision]));

export function getFrenchTopicPractice(lesson: Lesson): FrenchTransferTask | undefined {
  if (lesson.language === 'fr-FR' && lesson.status === 'draft' && frenchDraftRevisions.get(lesson.id) === lesson.revision) {
    return frenchTopicPractice[lesson.id];
  }
}

export const restaurantLesson = lessons.find(lesson => lesson.id === 'fr.restaurant.customer')!;
export const openCoursePilot = buildOpenCoursePilot(lessons.flatMap(lesson => lesson.vocabulary));
export { japaneseCourse } from './japanese-course';
export { japaneseLessons } from './japanese-lessons';
