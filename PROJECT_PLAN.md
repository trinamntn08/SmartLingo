# SmartLingo — implementation plan

Target product requirements, reviewed 2026-11-16. This plan describes intended behaviour; [STATUS](docs/STATUS.md) is authoritative for what this checkout implements and which milestone gates remain open. Commands belong in [README](README.md) and [local operations](docs/LOCAL_OPERATIONS.md).

## 1. Product direction

Build an approachable language-learning app for adults who want to function confidently in a new country and eventually master its language. Launch French first, with English explanations. The initial learner is an English-speaking newcomer to France, including complete beginners. English and Japanese are future target languages.

The personal app runs locally. A learner-only free website is designed in [plan 0025](docs/plans/0025-free-web-testing.md), with implementation on a separate task branch; no live service or hosted API is established here. Preserve a path to a commercial product while deferring subscriptions and a full account system. The developer implements; the owner tests and reviews the curriculum.

The first content is practical A1–A2 material, not a claim of a complete CEFR course or certification. Long-term mastery requires a much larger curriculum and assessment work.

## 2. Decisions and explicit assumptions

| Area | Decision | Basis |
| --- | --- | --- |
| Delivery | Web beta, then Android and iOS | Owner choice |
| Audience | English-speaking adults, especially newcomers to France | Owner choice |
| Teaching language | French; English explanations | Owner choice |
| French variety | Practical metropolitan French | Current owner project constraints |
| Future languages | English and Japanese | Owner choice |
| Learning paths | Guided course plus free topic exploration | Owner choice |
| Starting level | Include absolute beginners and foundational sounds | Owner choice |
| Grammar | Optional explanation beside a phrase or activity | Owner choice |
| Core activities | Pictures, vocabulary, sentence building | Owner choice |
| Speaking | OpenAI API conversation and formative feedback | Owner choice |
| Dialogues | Scripted, branching, and AI-assisted | Owner choice |
| Feedback | Supportive A1–A2 tolerance | Owner choice |
| Motivation | Calm progress; games later | Owner choice |
| Translation | Directly visible in study; deliberate recall reveal in practice | Owner correction, 2026-11-14; ADR 0008 |
| Audio | AI voice acceptable; reusable human audio optional | Owner choice |
| Content | Original material informed by public resources; owner reviews | Recommended implementation of owner's request |
| Admin | Edit all learning content and relevant presentation settings | Owner choice; scope defined below |
| Guest use | No registration in local personal beta | Interpretation of answer 26 |
| Later accounts | Optional sync first; commercial access rules decided later | Recommendation, not a confirmed future requirement |
| Offline | Downloaded/seeded lessons, cached audio, reviews, personal vocabulary | Recommended default |
| Voice retention | Temporary processing; optional local save | Recommended default |
| Appearance | Closely follow supplied references; English labels | Owner choice |
| Dark mode | Later release; theme tokens now | Owner choice |
| Working name | SmartLingo | Owner choice |

Begin with greetings and essentials, then practical daily situations including restaurants/cafés, shopping, transport, education and work. Support both customer/visitor and employee roles where useful. The current ordering is in the [course catalogue](docs/COURSE_CATALOGUE.md); the [curriculum review pack](docs/curriculum/README.md) proposes a separate A1/A2 revisit route.

## 3. Scope boundaries

### Original first testable slice

Historical starting scope, retained to explain the milestone design. The current catalogue is larger; this is not the present feature inventory or pending backlog.

- Responsive home, topic list, lesson screen, vocabulary detail, review screen, notebook, speaking screen, and basic editor.
- One complete restaurant lesson, plus a small greetings foundation lesson.
- Approximately 20–30 reusable vocabulary/phrase entries and one short dialogue.
- Image-to-word matching, vocabulary reveal/recall, and sentence building.
- Play word and sentence audio; meanings, translations and explanations visible directly in study views.
- Persist progress and saved vocabulary across browser reloads.
- One scripted role-play and an API-backed push-to-talk conversation path.
- A text fallback and understandable API-unavailable state.
- No paid calls without explicit learner action; content generation is a separate editor action.

### Personal web beta

- A reviewed practical curriculum in short lessons. The early six-collection/18-lesson sizing estimate has been superseded; use the current catalogue and prioritise approval/usability over volume.
- Beginner foundations: greetings, alphabet/sound awareness, articles, numbers, basic polite requests.
- Core situations include essentials, restaurants, shopping/errands, transport, school/university and workplace, with linked daily-life topics.
- Listening support in each lesson; pictures, vocabulary, and sentence building are the primary exercise modes.
- Scripted dialogues, a few branching scenarios, and contextual AI conversation.
- Scheduled reviews, manual flashcard mode, saved mistakes, custom vocabulary.
- Search across published content and personal entries.
- Edit/import/export content, review changes, publish locally, and restore content versions.
- Progress summary, privacy/settings controls, local backup/restore.

### Later

- Android and iOS release, optional accounts and cross-device sync.
- Larger A1–A2 curriculum, then B1/B2 based on demand and review capacity.
- English/Japanese courses, dark mode, culture, game elements.
- Validated pronunciation assessment, richer adaptive learning, exams, billing, public community features.

## 4. Learning flow

Onboarding: choose beginner/A1/A2 self-assessment, reason for learning, interests, and a proposed 10-minute daily goal. All choices remain editable. Allow skipping onboarding and browsing freely. Do not treat self-assessment or app activity as a certified level.

Today: continue a lesson, review due items, or start a suggested short session. Do not punish missed days.

Lesson sequence:
1. State a concrete outcome: e.g. order a drink politely.
2. Introduce 6–10 useful items with meaning, picture where appropriate, and audio.
3. Show these in a short sentence/dialogue. Display meanings, translations and grammar explanations directly in study views (owner preference updated 2026-11-14).
4. Practise matching and sentence building with helpful hints.
5. Attempt recall with reduced support.
6. Offer a contextual speaking role-play.
7. Show what was practised, useful corrections, and review/save actions.

Do not force speaking to finish every lesson. A learner must be able to study without a microphone. For conversations, offer employee/customer roles where relevant, sentence suggestions, slower responses, replay, and an English help button.

## 5. Feedback and review rules

- Sentence-building exercises support multiple valid sequences when applicable.
- Normalise casing, whitespace, and equivalent apostrophe forms where they do not change the target skill.
- Missing accents or minor spelling errors can receive 'almost correct' plus the corrected form in beginner practice. Keep accent-sensitive distinctions visible; do not silently accept a meaning-changing answer.
- Structural errors receive a short English explanation and a retry.
- Separate supported attempts from independent recall. Repeated hints must not produce the same mastery update as an unaided answer.
- Track recognition, production, and listening separately where exercised. Lesson completion alone is not mastery.
- For v1, use a transparent configurable review schedule (initial proposal: 1, 3, 7, 14, 30 days after independent success); an incorrect attempt returns an item sooner. This schedule is a product heuristic, not a validated prediction of memory.
- Store events and algorithm version so review scheduling can improve without losing history.
- Manual flashcard ratings remain available and separate from automatically graded attempts.
- Use local study dates/timezones and avoid creating duplicate reviews after refresh or retry.

## 6. AI speaking and vocabulary assistant

The target speaking journey combines a short recording, editable transcription, contextual response and replay behind provider adapters. The implemented recorded-input/text flow and explicit saved neural speech are separate features; [local operations](docs/LOCAL_OPERATIONS.md) describes their controls and privacy boundaries. Smooth real-time conversation and automatic response-audio generation remain future work.

The assistant uses selected topic, role, level, current target phrases, and recent conversation. Use short sentences, patient pacing, and limited new vocabulary. Give at most one or two useful corrections per turn or a summary at the end, depending on settings. Accept a request for English help.

Conversation feedback covers task completion, appropriateness, phrasing, and intelligibility where supported by audio. Transcription accuracy is not a pronunciation score. Avoid invented phoneme scores or claims of formal language assessment. Let users correct a mistaken transcript.

Vocabulary capture:
- Type an entry manually.
- Ask by text or voice: 'How do I say receipt?'
- Select a word/phrase from a lesson or conversation.
- Assistant proposes French, meaning, article/gender where relevant, example, and topic.
- Learner previews/edits and explicitly saves the entry; no automatic notebook pollution.
- Mark personal/AI-created content separately from reviewed curriculum.

Audio controls: obvious recording state, stop/cancel, replay, retry, text fallback, recoverable permission-denied state, short initial turn limit, and configurable session limit. A failed request must not submit repeatedly without user action.

## 7. Audio, pictures, and content production

Create original lessons and examples using reputable public references for research. Record sources, media attribution, and reuse permissions. Personal use is not a reason to copy entire courses or unlicensed image/audio collections; original content also makes later commercialisation easier.

Use coherent topic banks, normally 30–50 distinct words/phrases across short 6–10-item lessons. The 24-expression greetings opening is an intentional compact exception. Foundation and A2-only banks are valid when the task demands justify them. The [content guide](docs/CONTENT_GUIDE.md) owns authoring rules; the [catalogue](docs/COURSE_CATALOGUE.md) lists bundled content and the [review pack](docs/curriculum/README.md) holds unpublished refinements, recycling and B1/B2 extension goals. Word counts and lesson completion do not establish complete CEFR coverage.

Provide direct topic switching from the desktop sidebar or narrow-screen topic list. Clicking SmartLingo returns home. Show searchable word grids before optional practice, with the full lesson vocabulary together and visible English support. Disclose synthetic speech in Profile rather than repeating labels beside every speaker. [ADR 0010](docs/decisions/0010-visual-word-overviews.md) records this design.

Use simple illustrations for objects/actions when clear. Use realistic photographs selectively for menus, places, and practical contexts when permission allows. Abstract words need not have artificial pictures. Include meaningful alt text and avoid ambiguous exercise images.

Generate stable AI audio for approved content and cache it by text + language + voice + generation-settings hash. Reuse it rather than generate on every playback. A text change invalidates related audio until regenerated/reviewed. Clearly identify synthetic speech.

Content lifecycle: draft -> owner review -> published -> revised/archived. AI drafts never enter the published curriculum automatically. Review French accuracy, English meaning, naturalness, level, answer alternatives, image suitability, and audio. Keep source/provenance and version history.

## 8. Screens and visual direction

Learner navigation: Today, Explore, Practice, Review, Profile. Notebook is accessible from Review and the global save action. Editor is a separate local route.

- Today: next activity, continue lesson, reviews due, understated progress.
- Explore: topic cards, level filter, roles, free search.
- Topic: useful outcomes, lesson list, progress, download status.
- Lesson: one main activity, progress, audio, practice hints, directly visible meanings/grammar/translations.
- Vocabulary: article + word, visible meaning, example/translation, explanation, image, audio, notebook action.
- Practice: choose a skill or situation without following a course.
- Speaking: role selection, short brief, microphone, transcript, help, correction summary.
- Review: due queue, flashcards, mistakes, notebook.
- Profile/settings: goals, backup, audio/privacy options, usage, typography.
- Editor: curriculum tree, searchable entries, visual preview, publication status.

Match references closely: warm cream base, white rounded cards, dark text, yellow primary accents, green secondary accents, subtle raised borders/shadows, generous spacing. Preserve intent rather than reproducing desktop screenshots at phone scale. English replaces Vietnamese interface copy. Build semantic theme tokens for later dark mode and additional scripts.

Accessibility: keyboard navigation, visible focus, screen-reader labels, scalable type, touch targets, reduced motion, transcripts, and feedback that does not rely on colour alone.

## 9. Technical architecture

Implementation must follow the [architecture standards](docs/ARCHITECTURE.md#implementation-standards): clean, modular, maintainable, extensible code; one coherent responsibility per function; and clear separation between UI, learning rules, storage, and external services. Apply the linked review criteria to every implementation slice.

Implemented baseline: a TypeScript monorepo with an Expo/React Native web learner, a Node.js/Fastify local API, shared schemas/learning logic, and a web editor. Native storage/audio adapters remain planned. Exact package versions are pinned in the manifests/lockfile; do not assume web and native APIs are interchangeable.

Why: one main language for UI/server/types, a shared learner codebase for the three requested platforms, and a local server that can protect API credentials and serve editable content. A separate platform adapter handles browser/mobile storage and recording.

Repository structure (see [architecture](docs/ARCHITECTURE.md) for current responsibilities):

    apps/learner/          Expo app, web and future native targets
    apps/api/              local API, content database, AI adapters
    packages/domain/       schemas, answer checking, review scheduling
    packages/content/      validated draft content and bundled media metadata
    docs/                  implementation decisions and authoring guidance

The API uses SQLite for immutable curriculum revisions and a separate generated-speech cache/attempt ledger. Browser learning state/notebook uses versioned IndexedDB with backup/restore. Native SQLite is planned behind the same storage contracts; a shared UI package is deferred until concrete reuse warrants it. Keep idempotent learning events and stable IDs; defer a complex synchronisation engine.

The API may be needed to load uncached content; after a pack is downloaded, ordinary lessons/reviews must work without it. API speaking always needs network access and the local API process. Browser offline persistence is subject to device storage and eviction; export is the durable beta backup option.

Future hosting: move the API to a hosted service and consider managed PostgreSQL/auth/media, such as Supabase, when cross-device accounts are actually required. No cloud backend is necessary for this local beta.

Use runtime schema validation at content/API boundaries. Keep AI model identifiers configurable and select available models after testing French quality, latency, and account pricing. Do not hardcode pricing or make provider-specific objects the core data model.

## 10. Core data model

Conceptual target model, not a claim that each row is a separate implemented table or feature. Current contracts live in `packages/domain/src/`; current migrations belong to the API/persistence adapters.

| Entity | Key fields/relationships |
| --- | --- |
| Language | code, script, display names, locale preferences |
| Lexical entry | stable ID, target language, lemma/phrase, morphology |
| Sense/translation | entry, sense, explanation language, meaning, notes |
| Example | target text, translations, linked entries, optional grammar |
| Topic/lesson | outcomes, approximate level, prerequisites, activities, roles |
| Dialogue | role labels, lines, variants, audio |
| Exercise | type, prompt, valid answers, distractors, hints, feedback |
| Grammar note | title, explanation language, examples, linked activities |
| Media | source, rights, alt text, generation settings, hash, review state |
| Content revision | stable entity ID, version, draft/published state, timestamps |
| Learner profile | local ID, preferences, level self-report, timezone |
| Attempt/event | UUID, item ID/version, activity, result, hints, time |
| Review state | learner/item/skill, next due, schedule version |
| Notebook entry | personal ID, optional source entry, learner edits, examples |
| Conversation | topic, role, optional retained transcript, saved items |
| API usage | request ID, operation, provider-reported usage, optional cost estimate |

Store French morphology as extensible language-specific data, not mandatory columns for every language. Japanese scripts/readings and English-specific details will require their own content work later.

## 11. Editor scope

Target scope below. The current editor is a validated subset; [local operations](docs/LOCAL_OPERATIONS.md#run-the-preview) lists its implemented fields and publication flow.

'Edit everything' means edit topics, lesson order, outcomes, vocabulary, translations, example sentences, grammar notes, dialogue roles/lines, exercise variants/answers/feedback, pictures, audio choices, level tags, sources, labels, and theme settings. It does not mean an arbitrary application-code editor.

Provide create/duplicate/archive, validation errors, desktop/mobile preview, revision restore, import/export JSON, optional vocabulary CSV import, media replacement, and publish/unpublish. Referenced entries cannot be destroyed silently. Keep existing progress when content changes; record the attempted revision and deliberately reset affected reviews only when necessary.

The owner is the only editor initially. Bind the local API to loopback by default. Editor/API access must be authenticated before public hosting; a hidden URL is not access control. Phone testing over LAN needs an explicit development configuration and a local access token.

## 12. Offline, privacy, and operating cost

- Offline packs: lessons, approved media, exercises, grammar, and supporting vocabulary. Show download size/status, allow deletion, and recover interrupted downloads.
- Persist notebook, review queue, and attempts locally. Provide export/import and a clear reset action.
- Store the main OpenAI API key only in the server environment, excluded from source control; never in browser bundles or mobile binaries.
- Real-time browser voice later uses server-issued short-lived credentials, not the permanent API key.
- Process recordings temporarily; do not retain raw audio in application storage/logs by default. Offer explicit local saving and deletion. Explain external API processing separately from local retention; verify provider retention settings before making stronger promises.
- Default conversation transcript retention to off across sessions; learner can explicitly save a session. Keep only the small learning summary needed for selected progress features.
- No third-party analytics in personal beta. Log technical failures without raw voice content or API secrets.
- Pre-generated lesson audio reduces repeated API usage. AI conversation is on demand.
- Set turn/session limits, cancellation, request timeouts, and bounded retries. Display available usage, use configurable daily limits, and distinguish estimated cost from billing totals. No automatic top-ups.

## 13. Milestones and acceptance criteria

### M0 — planning baseline (this document)
Capture confirmed preferences, defaults, boundaries, sample lesson, and a prioritised implementation path. Owner can amend defaults while implementation progresses.

### M1 — runnable local foundation and first lesson
Scaffold shared app/API/domain, theme, navigation, storage, content schema, two seed lessons, audio abstraction, and first editor fields. Test the audio/storage approach early in a desktop browser and a representative phone browser. Browser microphone testing over LAN may require a secure origin; plan HTTPS or an appropriate local development route.

Accept when: a learner opens the app, chooses restaurant customer practice, completes a picture/vocabulary/sentence-building lesson with meaning/grammar visible directly, saves a word, reloads, and sees preserved state. Core lesson remains usable without an API key.

### M2 — speaking and personal vocabulary
Implement server-only API credentials, cached AI lesson audio, push-to-talk, transcript correction, contextual response, replay, vocabulary suggestions/save, usage limits, and permission/network failure states.

Accept when: a learner completes a short restaurant role-play, can request English help, saves an editable phrase from the exchange, and can stop recording/session. No durable raw recording remains unless deliberately saved. A timeout or duplicate click does not create uncontrolled repeated requests.

### M3 — complete personal web beta
Add remaining curriculum, review scheduling, search, offline packs, content publishing/revisions, backup/restore, and calm progress. Owner reviews each lesson before publication.

Accept when: downloaded lessons run after API shutdown/network loss; progress and notebook survive restarts; import/export round-trips; editor changes reach preview/published content correctly; mistakes receive useful feedback; keyboard/mobile flows are usable.

### M4 — learner testing and improvement
Start with owner testing, then optionally 3–5 adult learners. Observe onboarding, completing a lesson, returning for review, finding a phrase, and using speaking. Track actual errors and qualitative comprehension. Set learning/retention targets only once baseline observations exist.

### M5 — mobile preparation
Implement native storage/audio adapters and device permissions, test Android/iOS, and prepare installable builds. Device signing, iOS build tooling/accounts, public hosting, and store submission are distinct later tasks.

Delivery recommendation: use milestone gates instead of a calendar promise. Start with the M1 preview, obtain owner feedback, then estimate the remaining work from the working code and actual content-review pace. No launch date or delivery-duration commitment is set yet.

## 14. Verification strategy

- Unit checks where errors matter: answer normalisation/valid variants, scheduling/timezones, deduplicated events, content schema validation.
- Integration checks: editor publication, revision references, backup/restore, cached media invalidation, API credential boundaries, cancellation/failure paths.
- End-to-end smoke flow: lesson -> notebook -> review -> reload -> speaking fallback -> editor publish.
- Manual device checks: small screen layout, keyboard, audio, denied microphone, offline transitions, reduced motion.
- Validate sample French, translations, audio, and accepted answers with owner review. No certification claims based on app scores.

## 15. Remaining work (planning only)

The original scaffolding/first-lesson backlog has been completed. Choose the next bounded task from [current status](docs/STATUS.md#remaining-work), rather than replaying those steps. Current priorities are owner/device acceptance and content review, optional learner-only hosting, focused editor/learner controls and unresolved build-tool audit work. A listed opportunity does not authorise implementation or publication.

## 16. Remaining dependencies and non-blocking decisions

- Owner supplies an API key through local environment configuration when API testing begins; never through a committed file or a public chat artifact. Ordinary lesson implementation does not depend on the key.
- Owner reviews draft French/English content and early UX previews.
- The optional 10-minute goal and future onboarding/preferences need product review; metropolitan French, greetings-first entry and directly visible study support are current constraints.
- Public branding, billing, future account restrictions, hosted API/accounts, store release and launch date remain open. A free learner-only hosting proposal is separate from those larger decisions.

## 17. Reference notes and current technical sources

Local visual references reviewed: references/1.jpg through references/7.jpg. They show a cream/yellow practical French site with Vietnamese explanations, topic cards, word/sentence audio, conjugation, grammar exercises, and pronunciation. They do not provide source code, licensed lesson datasets, audio files, or editable design assets. Do not reproduce screenshot claims about immigration/exams as app advice; those are outside the first release.

Official documentation checked on 2026-11-14:
- Expo universal applications: https://docs.expo.dev/
- Expo audio: https://docs.expo.dev/versions/latest/sdk/audio/
- Expo SQLite/platform considerations: https://docs.expo.dev/versions/latest/sdk/sqlite/
- OpenAI audio overview: https://developers.openai.com/api/docs/guides/audio
- OpenAI text-to-speech and AI voice disclosure: https://developers.openai.com/api/docs/guides/text-to-speech
- OpenAI speech-to-text: https://developers.openai.com/api/docs/guides/speech-to-text
- OpenAI browser voice/WebRTC: https://developers.openai.com/api/docs/guides/voice-webrtc?voice-api=realtime

Recheck API/model/package details when implementing each integration. Do not build against deprecated session endpoints just because an older example uses them.
