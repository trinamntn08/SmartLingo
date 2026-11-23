# Browser adapter contracts

Primary owns `apps/learner/src/persistence/` and `apps/learner/src/audio/`. UI may import:

- `openLearningRepository(): Promise<LearningRepository>` from `./src/persistence/index` (adjust relative path). Rejects clearly if storage is unavailable; no silent volatile success. Repository methods in `@smartlingo/domain`.
- `audio: AudioPlayer` from `./src/audio/index`; `audio.available(): boolean`, `audio.speak(text: string): Promise<void>`, `audio.stop(): void`. Browser device speech only, explicitly labelled synthetic device speech; no API key. Promise rejects for unavailable French voice/playback failure; keep text path available.

All domain types/checkers imported from `@smartlingo/domain`. Content from `@smartlingo/content`: `lessons: Lesson[]`, `restaurantLesson: Lesson`. See domain source for exact schemas. UI loads events/notebook from repository, persists before claiming saved, and generates event IDs with crypto.randomUUID(). Notebook deterministic id `notebook.${entry.id}` prevents duplicate saves, while edits retain that id. Record a vocabulary viewed event on explicit Next, not a side effect on render. Mark lesson completion only after six items, picture correct, and sentence correct; hinted attempts have hints >= 1. Record completion as activity completion/result completed. Keep event IDs stable on retry of a failed write. Root handles adapter tests.

API: seed/read-only content preview. `GET /health` JSON, `GET /lessons` returns `{ lessons: Lesson[] }`, `GET /lessons/:id` returns `{ lesson: Lesson }` or 404. Drafts explicitly available for local preview; no publication claims, CORS or client connection required in this first slice.

Capture uses `repository.captureNotebook(entry): Promise<NotebookEntry>`: atomically create if absent, otherwise return the existing personal entry. The UI uses the returned data so a stale tab cannot overwrite personal edits with lesson defaults. `saveNotebook(entry)` is reserved for explicit notebook edits.
