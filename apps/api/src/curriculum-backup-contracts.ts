export type CurriculumSnapshotSummary = {
  schemaVersion: 1;
  lessonCount: number;
  revisionCount: number;
  publishedRevisionCount: number;
};

export type CurriculumSnapshotReport = CurriculumSnapshotSummary & { path: string };
