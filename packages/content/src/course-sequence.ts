import type { Lesson } from '@smartlingo/domain';

/** Default browsing/start order, not an assessment or a prerequisite lock. */
export const courseSequence = [
  { slug: 'greetings', prerequisites: [] },
  { slug: 'essentials', prerequisites: ['greetings'] },
  { slug: 'numbers', prerequisites: ['essentials'] },
  { slug: 'people', prerequisites: ['essentials'] },
  { slug: 'calendar', prerequisites: ['numbers'] },
  { slug: 'routine', prerequisites: ['numbers', 'calendar'] },
  { slug: 'directions', prerequisites: ['essentials'] },
  { slug: 'transport', prerequisites: ['numbers', 'calendar', 'directions'] },
  { slug: 'bakery', prerequisites: ['essentials', 'numbers'] },
  { slug: 'groceries', prerequisites: ['numbers', 'bakery'] },
  { slug: 'restaurant', prerequisites: ['essentials', 'numbers'] },
  { slug: 'shopping', prerequisites: ['numbers'] },
  { slug: 'housing', prerequisites: ['people', 'directions'] },
  { slug: 'leisure', prerequisites: ['routine', 'calendar'] },
  { slug: 'social', prerequisites: ['people', 'leisure', 'calendar'] },
  { slug: 'health', prerequisites: ['people', 'calendar'] },
  { slug: 'cooking', prerequisites: ['groceries'] },
  { slug: 'digital', prerequisites: ['essentials', 'numbers'] },
  { slug: 'accommodation', prerequisites: ['housing', 'calendar', 'digital'] },
  { slug: 'education', prerequisites: ['essentials', 'calendar'] },
  { slug: 'work', prerequisites: ['people', 'routine', 'digital', 'education'] },
  { slug: 'administration', prerequisites: ['people', 'digital'] },
  { slug: 'jobsearch', prerequisites: ['work', 'education'] },
  { slug: 'past', prerequisites: ['routine', 'social'] },
  { slug: 'opinions', prerequisites: ['shopping', 'leisure', 'past'] },
  { slug: 'cycling', prerequisites: ['directions', 'transport'] },
  { slug: 'household-waste', prerequisites: ['housing', 'calendar'] },
  { slug: 'workshop-check-in', prerequisites: ['greetings', 'essentials', 'people', 'routine'] },
  { slug: 'neighbourhood-wayfinding', prerequisites: ['workshop-check-in', 'directions'] },
  { slug: 'appointment-changes', prerequisites: ['workshop-check-in', 'calendar'] },
  { slug: 'travel-disruptions', prerequisites: ['appointment-changes', 'transport'] },
] as const;

/** Keep each topic's authored lesson order; unknown/custom banks remain reachable at the end. */
export function orderCourseLessons(lessons: readonly Lesson[]): Lesson[] {
  const ranks = new Map<string, number>(courseSequence.map((topic, index) => [topic.slug, index]));
  const rank = (lesson: Lesson) => ranks.get(lesson.id.split('.')[1]) ?? courseSequence.length;
  return [...lessons].sort((left, right) => rank(left) - rank(right));
}
