# SmartLingo — implementation plan

Target product requirements, reconciled with current source on 2026-11-22. This plan describes intended behaviour; [STATUS](docs/STATUS.md) is authoritative for what this checkout implements and which milestone gates remain open. [Repository state](docs/REPOSITORY_STATE.md) distinguishes the current Japanese-enabled learner from separate Android and hosted work. Commands belong in [README](README.md) and [local operations](docs/LOCAL_OPERATIONS.md).

## 1. Product direction

Build an approachable language-learning app for adults who want to function confidently in a new country and eventually master its language. Launch French first, with English explanations. The initial learner is an English-speaking newcomer to France, including complete beginners. The owner's 2026-11-19 request adds Japanese daily-course drafts through estimated B1 tasks; [plan 0029](docs/plans/0029-japanese-course-b1.md) records this bounded extension. English remains a future target language.

The personal app runs locally. A learner-only free website is designed in [plan 0025](docs/plans/0025-free-web-testing.md), with implementation on a separate task branch; no live service or hosted API is established here. Preserve a path to a commercial product while deferring subscriptions and a full account system. The developer implements; the owner tests and reviews the curriculum.

The first content is practical A1–A2 material, not a claim of a complete CEFR course or certification. Long-term mastery requires a much larger curriculum and assessment work.

## 2. Decisions and explicit assumptions

Owner correction, 2026-11-21: the homepage offers French or Japanese, followed by the same core learner widgets and flow. [Plan 0032](docs/plans/0032-shared-language-learning.md) and [ADR 0026](docs/decisions/0026-shared-language-learning.md) implement that shared interface while preserving existing content/history and explicitly scoped optional services.

The owner's subsequent minimum of 30 entries for every Japanese topic is implemented by [plan 0033](docs/plans/0033-japanese-topic-vocabulary.md): append short original lessons while preserving all earlier payloads and progress.

Owner visual/report direction, 2026-11-21: use the supplied friendly dashboard reference for shared French/Japanese Today and an in-app learning report. [Plan 0034](docs/plans/0034-friendly-learning-report.md) and [ADR 0027](docs/decisions/0027-read-only-learning-report.md) define the real saved-activity metrics and responsive cream/burgundy/gold widgets. Reference fixture names, points, child age bands and levels are not learner facts.

The shared learner uses Today, Learn, Review, Report and Profile. [Plan 0036](docs/plans/0036-unified-learning-hub.md) combines vocabulary, listening/videos and guided speaking; Japanese starts with 20 basic hiragana/katakana row lessons and independent saved continuation. The owner's 2026-11-22 simplification is implemented in [plan 0039](docs/plans/0039-calm-learner-redesign.md): one Today recommendation, topics in Learn, metrics in Report, grouped settings and focused study steps. Broader pronunciation content and owner/device acceptance remain open.

| Area | Decision | Basis |
| --- | --- | --- |
| Delivery | Web beta, then Android and iOS | Owner choice |
| Audience | English-speaking adults, especially newcomers to France | Owner choice |
| Teaching language | French and Japanese in one shared learner; English explanations | Owner extensions, 2026-11-19 through 2026-11-22 |
| French variety | Practical metropolitan French | Current owner project constraints |
| Future languages | English; broader coverage and review for implemented French/Japanese | Japanese shared learner is implemented |
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

French begins with greetings and essentials, then practical daily situations including restaurants/cafés, shopping, transport, education and work. Japanese recommends basic hiragana before katakana, with topic vocabulary and daily courses freely accessible. Support both customer/visitor and employee roles where useful. The current ordering is in the [course catalogue](docs/COURSE_CATALOGUE.md); the French [curriculum review pack](docs/curriculum/README.md) proposes a separate A1/A2 revisit route.

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
- English as a target language, broader Japanese coverage, dark mode, culture and game elements. Japanese basic kana, topic lessons and selected B1-labelled course tasks are already implemented drafts.
- Validated pronunciation assessment, richer adaptive learning, exams, billing, public community features.

## 4. Learning flow

Choose French or Japanese, then start the recommended lesson from the top of Today. A returning learner can continue from Today in one action. Japanese recommends basic kana first, with a course and short topic lessons also available. Course and topic lessons use the same reader with a separate Grammar step between Key phrases and Listen. The course outline lists lessons. Planned onboarding includes editable, optional self-assessment, study goals and interests. Activity records describe practice.

Today: continue a lesson, review due items, or start a suggested short session. Do not punish missed days.

Lesson sequence:
1. State a concrete outcome: e.g. order a drink politely.
2. Start with a short, bilingual dialogue. Display translations and grammar explanations directly in study views.
3. Study 6–10 key phrases in context with visible meanings, pictures where appropriate and audio.
4. Listen for a useful detail or meaning. Offer replay and an optional transcript, then show the answer and its meaning.
5. Practise matching and sentence building with helpful hints.
6. Attempt recall with reduced support.
7. Offer a contextual speaking role-play.
8. Show what was practised, useful corrections, and review/save actions.

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

Owner planning direction, 2026-11-17: develop a plan for an A1–B1 daily course usable directly inside the website, using eligible open materials and original authoring. The final source constraint excludes proprietary Taxi reproduction and seeking publisher permission. [Plan 0027](docs/plans/0027-open-course-integration.md) and [ADR 0022](docs/decisions/0022-open-course-planning.md) define the source/licence checks, integration stages and unresolved coverage. French currently has five original draft lessons in its A1 opening unit. Japanese has 13 original draft guided lessons and library lessons through selected estimated B1 tasks.

Owner direction, 2026-11-22. Use the [French daily-course plan](docs/plans/0043-french-daily-course.md) for the proposed A1–B1 route. Each course has eight seven-lesson units. Today recommends one lesson per study day, with resume and free exploration. Use SmartLingo-approved generated photography throughout the learner and editor, including the full French daily-course image path. [Imagery decision](docs/decisions/0037-model-generated-imagery.md)

Create original lessons and examples using reputable public references for research. Record sources, media attribution, and reuse permissions. Personal use is not a reason to copy entire courses or unlicensed image/audio collections; original content also makes later commercialisation easier.

Use coherent topic banks, normally 30–50 distinct words/phrases across short 6–10-item lessons. The 24-expression greetings opening is an intentional compact exception. Foundation and A2-only banks are valid when the task demands justify them. The [content guide](docs/CONTENT_GUIDE.md) owns authoring rules; the [catalogue](docs/COURSE_CATALOGUE.md) lists bundled content and the [review pack](docs/curriculum/README.md) holds unpublished refinements, recycling and B1/B2 extension goals. Word counts and lesson completion do not establish complete CEFR coverage.

Provide topic discovery and switching in Learn, with search and a clear All topics return. Clicking SmartLingo returns home. Topic pages show the lesson list first, with an optional searchable vocabulary section below. Keep English support visible within both. Disclose synthetic speech in Profile. [Lesson-first navigation](docs/decisions/0041-lesson-first-navigation.md)

Use simple illustrations for objects/actions when clear. Use SmartLingo-generated photographs selectively for places and practical contexts. Abstract words need not have artificial pictures. Include meaningful alt text and avoid ambiguous exercise images.

Generate stable AI audio for approved content and cache it by text + language + voice + generation-settings hash. Reuse it rather than generate on every playback. A text change invalidates related audio until regenerated/reviewed. Clearly identify synthetic speech.

Content lifecycle: draft -> owner review -> published -> revised/archived. AI drafts never enter the published curriculum automatically. Review French accuracy, English meaning, naturalness, level, answer alternatives, image suitability, and audio. Keep source/provenance and version history.

## 8. Screens and visual direction

Current learner navigation: homepage language choice, then Today, Learn, Review, Report and Profile. Notebook is accessible from Review and vocabulary save actions. The French editor is a separate local route. The list below distinguishes implemented destinations from planned controls.

Owner direction, 2026-11-22. Browser Back and Forward now cover learner screens and activity steps in the local web preview, with direct URLs for lessons and sections. [Browser navigation and validation plan](docs/plans/0045-web-navigation-and-lesson-links.md)

- French Today recommends a guided lesson. Learn opens the same lesson and saved section and lets learners explore vocabulary, lessons, listening and speaking. Japanese retains its kana-first recommendation. At the end of a French guided lesson, relevant library lessons offer optional practice with a return to that study section. Review opens saved words.
- Learn: Japanese letters when relevant, Lessons with topic cards and filters, Listening & videos and Speaking.
- Topic: numbered lesson cards with useful outcomes and saved progress, plus direct continuation from the completed lesson.
- Lesson: one main activity, progress, audio, practice hints, directly visible meanings/grammar/translations.
- Vocabulary: article + word, visible meaning, example/translation, explanation, image, audio, notebook action.
- Speaking within Learn: scripted role selection, model/partner playback and visible meanings/readings in either language; optional French AI conversation/recording remains separate.
- Review: language-scoped notebook, saved words, due recognition queue and manual supported/independent ratings. A dedicated mistakes collection remains planned.
- Report: read-only current-revision lesson/word/topic totals and weekly saved activity. No proficiency, points or inferred study-time metric.
- Profile: expandable audio, offline/backups, French curriculum tools and information groups. Goals, broader learner controls and typography preferences remain planned.
- Editor: implemented French draft fields, saved-revision preview and explicit publication; full curriculum-tree/media management remains planned.

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

Store French morphology as extensible language-specific data, not mandatory columns for every language. Shared Japanese lessons/course/notebook use kana readings and language-aware metadata; basic kana study has separate event-scoped progress. Device speech and optional free local Japanese audio are implemented. Broader script/kanji instruction, pronunciation assessment and English-specific details require further work.

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
- Owner reviews draft French/Japanese content, English support, readings, media and early UX previews.
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
