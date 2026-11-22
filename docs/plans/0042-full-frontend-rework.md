# Full SmartLingo frontend rework

Status **Implemented and verified on web** · 22 November 2026

## Outcome

The complete French and Japanese web learner and the local French editor share a readable, photo-led interface. From the opening screen, learners can choose a language, resume or browse, study and practise, save and review vocabulary, and find their report and settings. An author can find a draft, edit it, preview the saved revision and explicitly publish it. Each screen puts its main task and useful content near the top on desktop and phone.

## Visual direction

- Use the supplied course-library layout and presentation canvas as references. Create SmartLingo's own cream workspace, deep pine actions, bright gold highlights, clean white surfaces and independent imagery. Icons and restrained tints help scanning. Use larger, regular-weight study text and compact supporting controls.
- Put contextual photography in the language chooser, Today, topic cards and relevant lesson introductions. Use existing licensed literal word photos where suitable. New presentation images are bundled with provenance. Japanese cover scenes and French topic photos remain separate from exercise answer bindings.
- Use a single meaningful page heading, a small number of prominent actions, a search-led library, a clear study canvas, and distinct layouts for the notebook, report and editor. Keep study translations, kana, examples and grammar visible. On phones collapse rails and put useful content ahead of secondary controls.

## Ownership

- Primary owns the shell, shared design tokens and primitives, language chooser, Today, presentation media, and integration, docs and checks.
- Study builder owns Learn, the topic library and sidebar, topic and word cards, and the common lesson stage.
- Learner tools builder owns Review and notebook, Report, Profile, Listening and Speaking presentation.
- Course and editor builder owns daily course, Japanese kana and the local French editor workspace.
- An independent reviewer checks the integrated changes and the learner, storage and publication boundaries.

## Acceptance

Inspect actual desktop and phone renders of the language chooser, Today, catalogue, lesson, course, kana, listening, speaking, Review, Report, Profile and editor. Check keyboard navigation and compact controls. Keep language-scoped resume, notebook, progress, audio cleanup, backup, offline and explicit draft preview/publication alive through their existing interfaces. Run repository and application checks, browser regression tests and the exported cold-offline suite. Measure download size and verify newly bundled files are served and available offline. [Prior pilot](0041-visual-frontend-pilot.md) · [Visual plan](0040-visual-frontend-redesign.md)

## Verification and handoff

- The capture walkthrough opened 18 screen states at 320, 390 and 1,440px. It checked loaded Inter, main-viewport containment and browser errors, and used an in-memory curriculum API for editor captures. Desktop and mobile screenshots are in the local ignored `exports/frontend-rework` folder.
- `npm.cmd run check` and `npm.cmd test` passed (274 tooling and application tests). The final full browser sweep before the last course sizing fix passed 143 cases and found two narrow-course failures, with one existing skip. All 18 French and Japanese course cases passed on the final source, including both failures. The full offline sweep passed 23 cases including the new font/photo check, then all six course offline cases passed on the final export, including the one narrow-course failure. Offline fixtures ran on an isolated port because the existing preview uses `8082`.
- The final web export has 133 files, 11,461,010 bytes and build ID prefix `54b6698347d5`. The branch preserves learning, publication, audio and storage rules. Owner visual review, physical devices, real-device browser zoom and screen-reader checks remain open. [Media and font provenance](../MEDIA_SOURCES.md#bundled-presentation-scenes-and-type)
