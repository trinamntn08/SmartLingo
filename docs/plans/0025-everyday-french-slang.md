# Everyday French and slang

Status: completed in the learner preview.

## Outcome

A learner can open Slang from the main navigation and browse informal French used in metropolitan France. Each expression has an English meaning, an original bilingual example, a usage note, a register label and a photo for its situation. Learners can filter by category, search in both languages, listen to spoken forms and save phrases to their local notebook. The page works at 320px and in a downloaded web app.

## Implementation

- Keep the reference catalogue separate from course lessons and published revisions. Reuse the app's search normalization, speech, notebook and offline export.
- Draft expressions by situation, with register notes and a text shorthand label for chat abbreviations.
- Use original generated photos and the existing cream and yellow palette. Check the reference layout, keyboard controls, selected state, empty results and desktop and phone widths.
- Primary owns the shared contract, catalogue, images and UI. Curriculum authors own the two independent source files. A read-only reviewer checks the integrated feature.

## Verification

Repository checks, 18 tooling tests and 192 application tests passed. Chromium passed 83 browser tests with one intentional duplicate-publication skip. All eight exported offline tests passed, including a cold reload with a slang search and decoded photos. The 320px screenshot and geometry checks confirmed the narrow header and hero layout. The French content and generated scenes await owner review. [Session checkpoint](../SESSION_CHECKPOINT.md)
