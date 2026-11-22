# Visual frontend pilot

Status **Implemented and verified** · 22 November 2026

## Learner outcome

Open the redesigned Learn library, find Restaurant, start or resume **Order a coffee and ask for the bill**, and practise and save words with larger, readable study text. Use the same stage with Japanese kana and a meaning-first word lesson. Return to a browsed topic with its search, level and place in the list. The pilot is a working design review for [plan 0040](0040-visual-frontend-redesign.md).

## Implementation scope

- Establish cream, plum and gold visual tokens and an English navigation shell. Use a system font stack with Japanese fallback for this first checkpoint.
- Add rounded image-led library cards, locally bundled covers, a wide topic rail and a compact topic disclosure for phone and tablet widths. Keep the existing catalogue matching and progress signals.
- Give the existing vocabulary, dialogue, matching, sentence and finish sequence a large stage with a visible step outline. Use existing lesson, word, image and audio bindings. Make kana characters and readings easier to distinguish. Use the shared stage in the existing editor's saved-revision preview.
- Preserve the language, current content revisions, grading, completion, notebook and backup interfaces. Keep photo permissions and the existing fallback behaviour auditable.

## Ownership and acceptance

The primary agent owned shared tokens, navigation, integration, verification and documentation. Separate builders owned the library and study presentation. An independent reviewer checked the integrated change and the final focus, media and storage-error adjustments.

Verify type and layout at desktop and phone widths, plus keyboard navigation, browse return, notebook save, lesson completion, Japanese meaning practice and cold offline use. Run the repository and application checks and relevant browser and offline suites. Record actual checks and any limits at handoff.

## Results and handoff

- The responsive shell, Learn rail and topic selector, photo cards, lesson stage and enlarged kana visuals are implemented. Search, level and scroll state return with the browsed topic. Advancing a lesson moves keyboard focus to the new stage. [Decision and photo provenance](../decisions/0034-visual-frontend-pilot.md)
- `npm.cmd run check` and `npm.cmd test` passed. The final browser run passed 145 cases with one existing intentional skip. The complete offline suite passed 24 cases using an isolated port with equivalent fixtures and its own trace directory. The export has 126 files, 10,241,303 bytes, and build ID prefix `3c65ffbf3b17`.
- Inspected the exported desktop and phone layouts at 1,440, 390 and 320 pixels. Independent checks covered intermediate widths and keyboard topic selection. Actual browser zoom, screen-reader and physical-device speech acceptance remain open.
- Next phase after pilot review is broader learner rollout and media curation, followed by the editor workspace. The existing saved-revision editor preview already uses the shared lesson stage. [Redesign plan](0040-visual-frontend-redesign.md) · [Checkpoint](../SESSION_CHECKPOINT.md)
