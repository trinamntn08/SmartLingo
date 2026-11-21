# Task: Shared French and Japanese learner experience

Status: completed
Owner: primary agent

## Outcome
The homepage offers French and Japanese. Choosing either opens the same Today, Explore, Practice, Review and Profile navigation, topic sidebar, vocabulary grids/cards, dialogue, meaning/picture practice and sentence-building screens. Learners can change language from the header/home. Language choice persists when storage is available. English explanations remain visible. Both languages support personal vocabulary and recognition review, with language-scoped lists/progress and private backups containing both.

## Relevant context
Owner correction on 2026-11-21 explicitly requires the same widgets/display and start-to-learn journey for both languages. Reuse existing Japanese material from origin/feat/japanese-course-b1 at 58fe9b6, and newer French listening/two-day work from origin/feat/daily-course-continuation at ee23e93. Neither branch alone contains both. [Architecture](../ARCHITECTURE.md) and [Japanese provenance](../curriculum/japanese-course-sources.md) apply. No merge to main, deployment, paid call or curriculum publication.

## Steps and ownership
- Primary integrates existing branch changes in isolated worktree shared-language-learning, owns domain contracts, speech/controls, tests, docs and Git. Preserve original checkout's unrelated backup.spec.ts status.
- UI builder owns App.tsx, src/content/useCatalogue.ts, src/language/*, ui/LessonScreen.tsx, TopicCatalogue.tsx, VocabularyCard.tsx, Notebook.tsx, PersonalWordForm.tsx, review/ReviewPanel.tsx and course/{CourseBlockView,OpenCoursePanel,JapaneseVocabularyCard}. Reuse actual shared components and remove the separate Japanese vocabulary widget.
- Content worker owns only packages/content/src/japanese-lessons.ts and docs/curriculum/japanese-shared-lessons.md. Project the existing 13 immutable Japanese course days into Lesson records with preserved vocabulary/readings/dialogue; author explicit sentence exercises. Primary owns exports.
- Independent reviewer is read-only after integration.

Shared contracts: domain exports TargetLanguage = fr-FR | ja-JP, targetLanguages, languageNames, notebookLanguage (legacy absent = French). Vocabulary accepts optional reading/exampleReading; dialogue accepts optional reading. Lesson level additionally supports B1; no assertion of full coverage. Existing course payloads/IDs/revisions/events remain intact, including French unchanged-day progress scopes. Export japaneseLessons separately; existing French lessons export/API seeding stay French. Speak accepts optional language (French default), routes Japanese only to a Japanese device voice, hides French neural generation. No database migration; use Japanese backup-v4 support already implemented. Shared language picker blocks switching during pending writes.

## Validation
Run npm.cmd run check, npm.cmd test, desktop/320px shared-language journeys, focused original French/Japanese course checks, build:web and cold-offline language switch/lesson/notebook/reload. Verify legacy French payload identities, kana dakuten search, Japanese metadata backup/restore, language-correct speech fakes, unavailable-storage browsing and no French provider requests in Japanese. Inspect exported screenshots. No physical-device or native-speaker acceptance inferred.

## Progress and decisions
Fetched origin: Japanese 58fe9b6 and French ee23e93 match local branches. Topic worktree isolates changes from existing previews and owner work. Reusing Japanese commit by selective conflict resolution; new French progress/day payloads and listening library retained. Account allowance reporting unavailable; no automatic-resume schedule. UI/content helpers use exposed gpt-6.1-sol medium per SESSION_WORKFLOW; independent reviewer uses exposed model. Prepared role instructions read explicitly, no automatic client-loading claim.

## Handoff
Implemented homepage language selection and the shared core journey. JapaneseVocabularyCard is removed; both short lessons and daily-course vocabulary reuse VocabularyCard. Shared notebook supports personal Japanese entries/readings, language-scoped reviews, and mixed backup v4. Japanese device speech/settings reuse the same controls with separate preferences and no French cache/provider lookup. French listening/AI services retain their explicit scope.

Actual verification (2026-11-21): npm.cmd run check PASS; npm.cmd test PASS 18 tooling/214 application tests. Full Chromium regression initially 103 passed/1 intentional duplicate-publication skip/6 test-adaptation failures. Explicit empty restore contexts and a render wait after Reload learning resolved those failures; final focused backup/course/shared suite PASS20/20. This establishes coverage of all 109 active scenarios across the initial run and corrected focused rerun, not a newly repeated single full run. Exported desktop/320px shared suite PASS6/6, including both complete lesson journeys, mixed-language backup download/fresh-context restore, personal kana search, review-failure dismissal and unavailable persistence.

Build:web PASS126 assets/9,922,753 bytes/build f87477ccbe0cc892ec4bc4ebac827a1782fc6a0904632a4d32e31629b267e8d1. Full final cold-offline suite PASS18/18, including both French days, Japanese B1 cursor, shared Japanese lesson completion/reload/language switch, download/update/removal and zero remote course/media/provider requests in focused shared journeys. Initial offline run exposed retained test-server stalled-document mode between specs; explicit per-spec mode reset fixed isolation, with no application source change.

Independent review found one navigation recovery defect for failed ratings; resolved with explicit dismiss/reread-history and verified browser failure injection. No remaining actionable source findings. Primary inspected desktop and 320px homepage/shared-card/recognition screenshots and reviewed combined diffs. Local updated preview serves localhost:8082, HTTP200 verified. No publication/hosting, real audible quality, physical-device/Safari/native/screen-reader or qualified Japanese acceptance claimed. Existing course histories are preserved; new lesson exercise completion is deliberately independent. Final checkpoint commit/push recorded at handoff.
