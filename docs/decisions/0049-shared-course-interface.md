# Shared course navigation and presentation

Date — 2026-11-27

SmartLingo uses the French course interface for both supported learning languages. Learn brings learners to the same topic landing and Courses action. The launcher uses the same controls and progress messages on Today, Learn and the selected course. The reader retains the shared five steps, with matching exercise controls, browser navigation and saved progress conventions.

The content package owns the `languageCurricula` registry. Each entry provides its ordered topic lessons and guided courses. Both languages supply ordered units through `courseOutlineUnits`. The Japanese outline groups its immutable course payload using existing presentation metadata. The outline offers level filters for courses spanning several proficiency levels. French continues to have dedicated A1, A2 and B1 courses. Japanese keeps its existing thirteen-lesson course and three units.

Japanese letters remain a dedicated Learn section and a Today recommendation while relevant. The kana recommendation shares the course launch card and its primary action styling. Shared study surfaces render existing Japanese readings, audio, writing, and optional practice. French publication and optional French AI remain scoped to the services that support them.

The refactor keeps existing paths, authored day and activity IDs, progress revisions, and learning stores. Older course-block URLs still resolve through the shared reader. The Japanese Learn tab opens the existing topic landing at `/learn/ja`. Bookmarks under `/learn/ja/letters` still open kana. [Execution plan](../plans/0062-shared-course-interface.md)
