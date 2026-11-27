# Task: redesign the learner with unslop

Status: completed

## Outcome

Students can choose French or Japanese, start or resume a lesson, find the library and practice tools, and return to saved words with one consistent visual hierarchy. Preserve existing URLs, content, visible study support, keyboard behavior and persistence.

## Audit

- Today uses a full yellow panel, a separate photo card, pastel icon boxes and multiple raised shortcuts, all at similar prominence.
- The navigation uses six colored icon tiles and a heavy selected outline.
- The chooser uses two identical cards under a generic heading with an additional sentence that repeats the selection action.
- Repeated heavy headings, uppercase labels, rounded badges and shadows take emphasis away from the learning material.
- Study and utility screens repeat nested panels where typography, spacing and dividers can group related information.

## Direction

- Product. Practical French and Japanese study for English-speaking adults.
- Character. Warm, precise and unhurried.
- World. A study notebook with cream pages, dark ink and ruled rows.
- Moments. Existing neighbourhood photos at entry, with vocabulary, dialogue and kana taking the lead during study.
- Signature. A narrow yellow page marker for the current lesson or step.

## Steps and ownership

- Primary agent owns the shell, shared tokens, entry screens, course launch, documentation and integration.
- UI builders own study and kana; topics and skills; notebook, report and profile, respectively. They use the existing shared contracts.
- Adapt compatible presentation ideas from Cloud `eb7202a61d0e9c5ba36d94aa73ca7edc3aa10de8` against the current reader and catalogue.

## Validation

- Repository and TypeScript checks, 18 tooling cases and 290 application cases passed.
- Chromium covered 201 distinct passing learner and editor cases across the full run and targeted reruns, with one existing skip. All 34 cold-offline cases passed. Eight targeted offline cases passed again against the final build.
- Inspected the final preview at 1440×960 and 320×568. The chooser, French reader, catalogue, adapted Cloud lessons, Slang and kana all fit horizontally. Kana keyboard focus lands on the current study or recognition heading and then moves to its audio control.

## Handoff

Port 8082 serves export `29bf367f0316928a0f6903be9998561e8e5a5dcd7c080af7e9b66058b16ec0e2`. All 149 served files matched the export manifest’s sizes and digests. Physical devices and screen readers remain unverified.

Design method adapted from unslop by Damir Sokolovsky, CC BY 4.0. [Unslop](https://heydamir.design/unslop)
