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
import { buildFrenchCourses } from './french-courses';
import { everydayPractice } from './french-practice/everyday';
import { foundationPractice } from './french-practice/foundations';
import type { FrenchTransferTask } from './french-practice/types';
import { a1CourseAliases, a1CourseTasks, a1CourseTopics } from './topics/french-course-a1';
import { a2CourseAliases, a2CourseTasks, a2CourseTopics } from './topics/french-course-a2';
import { b1CourseAliases, b1CourseTasks, b1CourseTopics } from './topics/french-course-b1';

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
const openingLessons = [
  ...buildGreetingsLessons(existingLessons.flatMap(lesson => lesson.vocabulary)),
  ...existingLessons,
];
const courseDrafts = {
  A1: reuseSharedVocabulary(a1CourseTopics.flatMap(buildTopic), openingLessons.flatMap(lesson => lesson.vocabulary), a1CourseAliases),
  A2: reuseSharedVocabulary(a2CourseTopics.flatMap(buildTopic), openingLessons.flatMap(lesson => lesson.vocabulary), a2CourseAliases),
  B1: reuseSharedVocabulary(b1CourseTopics.flatMap(buildTopic), openingLessons.flatMap(lesson => lesson.vocabulary), b1CourseAliases),
};
export const lessons: Lesson[] = orderCourseLessons([...openingLessons, ...Object.values(courseDrafts).flat()]);
export const frenchTopicPractice: Readonly<Partial<Record<string, FrenchTransferTask>>> = {
  ...foundationPractice,
  ...everydayPractice,
  ...a1CourseTasks,
  ...a2CourseTasks,
  ...b1CourseTasks,
};
const frenchDraftRevisions = new Map(lessons.map(lesson => [lesson.id, lesson.revision]));

export function getFrenchTopicPractice(lesson: Lesson): FrenchTransferTask | undefined {
  if (lesson.language === 'fr-FR' && lesson.status === 'draft' && frenchDraftRevisions.get(lesson.id) === lesson.revision) {
    return frenchTopicPractice[lesson.id];
  }
}

export const restaurantLesson = lessons.find(lesson => lesson.id === 'fr.restaurant.customer')!;
const french = buildFrenchCourses(buildOpenCoursePilot(openingLessons.flatMap(lesson => lesson.vocabulary)), courseDrafts, frenchTopicPractice);
export const frenchCourses = french.courses;
export const [openCoursePilot] = frenchCourses;
export const frenchCourseLessonsByDay = french.lessonsByDay;
export { japaneseCourse } from './japanese-course';
export { japaneseLessons } from './japanese-lessons';

export { japaneseDailyGuides, japaneseDailyUnits, getJapaneseDailyGuide, type JapaneseDailyGuide } from './japanese-daily-practice';
export { currentJapaneseStudyExplanation } from './japanese-study-copy';
