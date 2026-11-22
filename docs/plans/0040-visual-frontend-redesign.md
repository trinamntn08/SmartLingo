# SmartLingo visual frontend redesign

Status **Proposed for review** · 22 November 2026 · Web beta

## Outcome and scope

Make SmartLingo easier to read, easier to browse, and more visual for adult French and Japanese learners. The intended path is **choose a language → browse or resume → open a lesson → study and practise → save a word and review it**. Plan the full learner frontend and the local French curriculum editor. Deliver the shared learner first and use the same lesson presentation in the editor preview.

The verified baseline already has a shared learner, five main destinations, focused lesson steps, a Japanese kana area, daily courses and recovery flows. Build on those entry points and the current Expo/React Native web stack. Keep presentation changes within the existing feature boundaries and reuse the typed navigation, learning, media and persistence interfaces. Native packaging, hosting, new curriculum and new authoring capabilities are outside this redesign's scope. [Current status](../STATUS.md) · [Product plan](../../PROJECT_PLAN.md#8-screens-and-visual-direction) · [Architecture](../ARCHITECTURE.md) · [Current design system](../DESIGN_SYSTEM.md)

## Visual direction

- Take the first supplied screenshot's clear global navigation, topic sidebar and large visual cards into **Learn**. Keep the sidebar local to the library. Surface the title, real learning outcome, estimated level where available and progress where relevant. In a topic, show short lessons before the vocabulary collection.
- Take the second screenshot's large canvas and step thumbnails into the **lesson stage** and **saved-revision preview**. Use an original SmartLingo layout with warm cream surfaces, white cards, dark plum text, gold primary actions and muted sage, sky or lilac tints for grouping. Limit soft decorative detail to headers and illustrations. Keep busy patterns away from reading and answer areas.
- Use realistic photos of everyday settings, objects and actions. Favour an adult course-book feel with occasional original illustration for scenes or ideas that are difficult to photograph. Keep the reference product's artwork, branding, and lesson materials outside SmartLingo assets. The warm palette, rounded cards, compact practice areas and visible audio controls also follow the seven earlier project references. [Repository reference set](../../references/)
- Put English on controls, navigation and explanations. Give the target text the strongest type and allow French accents, Japanese script and long kana readings to wrap. Trial bundled, licensed **Atkinson Hyperlegible Next** for Latin UI and French, with a Japanese-capable system fallback. Verify glyphs, weight and offline rendering in the pilot before choosing the final font files.

| Element | Proposed size on web | Treatment |
| --- | --- | --- |
| Page title | 42–48 px desktop, 32–36 px phone | Clear first heading with room for a two-line title |
| Section and card titles | 22–28 px | Strong hierarchy above the body copy |
| Body, translations and examples | 18–20 px | About 1.5 line height and comfortably spaced paragraphs |
| Navigation, labels and action text | 16–18 px | Always visible for essential actions, with at least 44 × 44 px targets |
| Target word or phrase | 32–48 px | Largest text on a study card, with a nearby speaker control |
| Main kana character | 52–72 px | Large glyph with separate romaji and English sound guidance |

These are starting targets. Test reading comfort, wrapping and focus at browser zoom and with Japanese fallback fonts before fixing the scale. Small supporting text can use 14–16 px, with key lesson content and controls at the sizes above.

## Screen-by-screen design

| Screen | Proposed layout and behaviour |
| --- | --- |
| Language chooser | Two generous illustrated or photographic choices with clear **French** and **Japanese** labels. Keep the language switch easy to find once inside the app. |
| Today | One prominent **Start** or **Continue** card with photo, next step and a clear action. Keep the daily course and Review, Listening and Speaking entries secondary. For new Japanese learners, show a kana-led recommendation with an immediate way to explore topics. |
| Learn library | Library-local topic sidebar, **All topics** return, breadcrumb and wide search. Keep existing language-scoped matching for topics, words, readings and English meanings. Use image-led topic cards, clear selected filters and a helpful empty search state. Keep Japanese letters, Listening & videos and Speaking visible within Learn. |
| Topic and vocabulary | One context photo with the topic outcome, then lesson cards and a searchable word collection. Show target text, English meaning and audio on each vocabulary card, with easy access to save, example, translation, usage and Japanese readings in study. Choose flexible image proportions so photos and longer labels can coexist. |
| Lesson and practice | Large stage for the current activity, with a small labelled outline for the existing vocabulary, dialogue, matching, sentence building and finish sequence. The outline shows current and completed steps and respects existing progression rules. Give learners a clear return action and readable step progress. On study steps, display meaning, readings, examples and grammar directly. Matching uses a large unambiguous picture or the existing meaning prompt, sentence tiles wrap and support keyboard/tap, and feedback explains how to retry. Completion confirms what was practised and supports the next action without implying proficiency. |
| Daily course and kana | Reuse the stage for the current course section or kana row. Present the day and section chooser or row chooser as secondary controls. Keep Japanese characters, romanization, model audio and recognition choices legible. Retain separate course, row and lesson resume. |
| Listening and speaking | Display a clear prompt, prominent replay, readable transcripts and English support at the appropriate point in the exercise. Use modest cards for external resources and preserve their explicit outbound links. Show speaking roles and model lines prominently. Keep optional French AI and recording visibly separate from scripted practice and retain text fallback. |
| Review and notebook | Put **Start review** and saved-word search up front. Improve card spacing and edit forms, with separate recognition prompts, reveal and ratings. Use photo thumbnails only where they help identify a saved entry and keep the review prompt free of answer cues. Design empty, loading, retry and save-error states. |
| Report | Enlarge metric values and labels, pair the weekly chart with accessible activity text, and retain language-scoped counts, empty states and retry. |
| Profile | Group language, voice and speed controls, offline download, private backup/restore and local curriculum tools. Keep storage errors, progress and confirmation states close to their actions. Destructive actions retain their existing safeguards. |
| French curriculum editor | On wide screens use a searchable lesson list on the left and either draft fields or the large saved-revision preview on the right. Group fields by lesson details, vocabulary, dialogue and grammar. Use one column on small screens. Show dirty, saved, stale and previewed states in a visible action area. The author reviews and explicitly publishes the saved revision. Reuse the learner stage for temporary preview practice, with author answers and rights details in a distinct review section. |

### Responsive and interaction rules

- **Desktop, around 1,050 px and up.** Keep the global header with Today, Learn, Review, Report and Profile. Use a roughly 240–270 px topic rail within Learn, with two roomy content cards per row and an optional third on wide displays. Constrain reading columns within large stages so translations and notes remain comfortable to follow.
- **Tablet, around 600–1,049 px.** Put topics in a labelled drawer or selector and use up to two cards across when the content fits. The lesson canvas and editor preview get one main column.
- **Phone, below roughly 600 px.** Keep compact app navigation, one principal column and accessible **Topics** and **Lesson steps** buttons. Ensure mobile navigation and any fixed lesson controls leave the current field, action and keyboard focus visible. Return focus from a drawer or dialog, and restore topic selection, filters and scroll when returning from a lesson within the same browsing session.
- Compose reusable shell, media card, lesson-stage header and feedback patterns from existing UI primitives. Use feature-owned layouts for lesson, editor and notebook workflows. Keep semantic roles, visible selected/current states, text equivalents for icons and charts, live save/feedback announcements, reduced-motion support and keyboard operation. Target 4.5:1 text contrast for normal text and test phone-width reflow at 200% browser zoom.

## Photo and illustration plan

| Use | Treatment | Initial priority |
| --- | --- | --- |
| Topic cover | 16:9 contextual photo, framed to crop cleanly on phone. Keep titles and labels rendered as text outside the photo. | French Restaurant and Bakery, and an existing Japanese daily-life topic after source review |
| Vocabulary photo | 4:3 or square crop with one clearly identifiable object or action, a useful text description and exact language/word/sense binding. | Reuse verified French Restaurant photos. Review a small first Japanese set for concrete nouns or actions. |
| Lesson or course introduction | One wide scene or original illustration to establish where the learner will use the language. | The French café pilot and one Japanese practical scene |
| Matching and recall | Use an image only if it clearly represents the intended answer without giving it away through text. Keep English meaning prompts for abstract language, ambiguous pictures or missing media. | Verify French picture and Japanese meaning-first activities in the pilot. |

1. Inventory current photos and original illustrations first. French has an audited vocabulary photo catalogue. Japanese currently uses written meaning support and has no assigned vocabulary photos. Keep contextual cover assets separate from item-level answer assets. [Photo coverage](../PHOTO_COVERAGE.md) · [Photo rights](../PHOTO_SOURCES.md) · [Original visual records](../MEDIA_SOURCES.md)
2. Source actual photos for literal objects and places. Consider original generated or commissioned imagery for contextual covers where it helps. Review every asset for target accuracy, cultural context, crop, legibility and rights. Record origin, author or generation provenance, licence, attribution, modifications, stable binding and alt text.
3. Bundle reviewed assets locally. Use right-sized JPEG or WebP after confirming the Expo export and offline path, reserve aspect ratio space, defer below-the-fold decoding/loading and show a graceful text fallback if a file is absent. Start with proposed budgets of 180 KB per card photo, 300 KB per hero and 2 MB incremental export size for the pilot's visual assets and fonts combined. Measure against a fresh baseline before broader rollout and keep the complete download within the existing 100 MiB offline limit.
4. For practice, retain existing content and scoring rules. Decorative covers and supportive study photos do not change exercise answer bindings. Any future curriculum image or exercise change that affects the prompt follows the existing content revision and review process.

## Delivery sequence

| Phase | Work | Exit criterion |
| --- | --- | --- |
| 1. Baseline and design | Reconfirm the source, capture current desktop/mobile journeys, and measure export size. Produce large-type desktop and phone mockups for Learn, a lesson, and an editor preview. Define color, font, spacing, image ratios and fallback states using the existing design tokens. | Reviewable original layouts show both scripts and realistic sample assets. Owner review establishes the visual direction before broad rollout. |
| 2. End-to-end learner pilot | Implement the shared shell, learner library and lesson stage for **French → Restaurant → Order a coffee and ask for the bill**, including the existing practice and notebook save. Run the same layout through **Japanese → Hiragana** and an existing Japanese meaning-first word lesson. Start with approved French assets and text-safe Japanese fallbacks. | Learners can browse, practise, save, leave and resume on desktop and phone. Pilot reads well at 320 px, has verified asset fallbacks and works from a cold offline download. |
| 3. Full learner rollout | Bring the shared layouts to Today, all topics and vocabulary, daily courses, listening, speaking, Review, Report and Profile. Add approved media in topic batches, starting with the highest-value concrete scenes. | Every current learner destination uses the visual system in both languages. Each topic has a reviewed cover or a deliberately chosen category visual. Existing settings, activity counts, backup and optional features remain usable. |
| 4. Editor workspace | Update the local French editor shell and draft form groups, and show saved revisions using the new learner stage. Keep save and preview status, concurrency errors, author review and explicit publication easy to follow. | In isolated test data, an author can save a revision, preview it, review it and publish deliberately. Unsaved edits and preview practice preserve their existing lifecycles. |
| 5. Acceptance and handoff | Review all screens and state variations on desktop and mobile, run full documented suites, check accessibility and export/media budgets, and capture final comparison screenshots from the same journeys as Phase 1. Record approved design decisions and update the design system and status docs as capabilities land. | Checks pass, physical-device limitations are documented, and the owner has a web preview and a complete walkthrough for visual acceptance. |

During implementation, the primary agent owns the shared tokens, shell, contracts and final integration. Delegate separate learner feature groups, editor presentation and media preparation with exclusive file ownership once the pilot establishes stable components. Have an independent reviewer check the combined result. Checkpoint each validated slice according to the repo workflow. [Implementation standards](../ARCHITECTURE.md#implementation-standards) · [Session workflow](../SESSION_WORKFLOW.md#automatic-checkpoint-commits)

## Acceptance checks for implementation

- **Readability and access.** Inspect 320, 390, 768, 1,024 and 1,440 px viewports with long French strings and Japanese readings. Verify wrapping, contrast, pointer target size, keyboard navigation, focus return and alerts, 200% zoom, reduced motion, and at least one screen-reader walkthrough. Check a physical phone for scrolling, keyboard and sound when available and report its actual results.
- **Learning continuity.** Test a fresh learner and an existing learner with history in both languages. Language switching preserves separate progress and notes. The same IDs and revisions drive completion, review, daily-course/kana resume, report totals and notebook edits. Include save failure, retry with the same event, backup/restore and loading or empty states. Keep test data isolated from the owner's browser profile and database.
- **Media and offline.** Check photo crops, missing-image behaviour, Japanese fallbacks, visible credits and export bytes. Download, cold-start offline, and open the pilot lesson and Review with the correct text, images and fonts. Check download update and removal. Verify navigation and images initiate neither paid generation nor external media loads.
- **Speaking and editor.** Verify audio stop on navigation and continuation without a microphone. Test temporary French recording/transcript cleanup with fakes, and check that editor preview never writes learner history or publishes on its own. Exercise dirty draft transitions, saved-revision conflict, failed preview and explicit publish with isolated revisions.
- **Commands.** Use `npm run check`, `npm test`, targeted Playwright checks per slice, and full `npm run test:e2e -- --workers=2` and `npm run test:offline` before final handoff. The offline command builds the web export. Run `git diff --check` and final staged checks for checkpoints. [Verification guide](../TESTING.md)

## Planning handoff

The first implementation checkpoint is the shared visual system and French Restaurant pilot, with Japanese kana and meaning-first checks alongside it. Typography, breakpoint values, photo budgets and editor layout are proposals to verify with the mockups and pilot. This checkpoint delivers the plan. Mockups, asset production and UI implementation are future steps in the sequence. [Work log](../WORK_LOG.md#2026-11-22-whole-frontend-redesign-plan) · [Session checkpoint](../SESSION_CHECKPOINT.md)
