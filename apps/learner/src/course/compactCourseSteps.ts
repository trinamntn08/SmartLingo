import type { CourseBlock, CourseDay } from '@smartlingo/domain';

const openingSteps = [
  { kind: 'dialogue', blockKind: 'dialogue', title: 'Dialogue' },
  { kind: 'practice', blockKind: 'choice', title: 'Quick practice' },
  { kind: 'reflection', blockKind: 'reflection', title: 'Try it' },
] as const;

export function compactCourseSteps(day: CourseDay) {
  if (!day.compact) return undefined;

  return openingSteps.map(({ kind, blockKind, title }) => {
    // Compact days are validated for all three anchors as part of the course schema.
    const anchor = day.blocks.find(block => block.kind === blockKind)!;
    return { kind, title, anchor };
  });
}

export function compactCourseStepKind(block: CourseBlock) {
  if (block.kind === 'choice') return 'practice';
  if (block.kind === 'reflection') return 'reflection';
  return 'dialogue';
}
