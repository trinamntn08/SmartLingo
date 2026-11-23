# Session checkpoint

Updated 2026-11-23, Europe/Paris. The owner asked for more French topics and lessons and requested a sub-agent to give Japanese the same learner interface. Work is on `feat/french-topics-japanese-course`, based on `2249086` from `chore/cloud-workflow`.

## Implemented

- French now has 27 topics and 133 lessons. Cycling and household waste each add five draft lessons and 30 vocabulary targets. Existing bicycle and lid senses are reused. A direct comparison against the base confirmed that all 123 earlier French lesson payloads match exactly.
- The learner switches courses from the header. Japanese has four bundled drafts across greetings, introductions and cafés, with kana readings, English explanations, matching, sentence practice and Japanese device speech. It shares the French learner interface. Existing French provider features and curriculum publication retain their current paths.
- Each course shows its own progress, notes and review queue. The courses share the existing browser database and backup format. French remains the default and the last choice persists locally.
- The UI builder and independent reviewer used the exposed `gpt-6.1-sol` model at medium reasoning. The primary authored the lessons, integrated the UI and fixed the shared header’s brand row wrapping at 320 px. No usage or allowance data was exposed. No automatic resume was configured.

## Verification

Repository checks and TypeScript pass. `npm test` passes all 18 tooling and 193 application tests. The independent review confirmed the domain and audio boundaries. The initial system Chromium suite recorded 79 passes and one intentional skip. The final 10-case targeted run passed both Japanese journeys and every earlier failing case after the header correction and update to the kana reading assertion. All eight serial exported offline cases passed, including opening Japanese and saving a word after a cold reload on desktop and at 320 px. The tested export has 126 files and build prefix `95c2f99a8b98`.

## Next step

The commit containing this note is the local checkpoint. Owner review of the draft lessons and actual Japanese voice audition remain open.
