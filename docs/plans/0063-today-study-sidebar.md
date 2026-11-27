# Task: simplify Today and add a study sidebar

Status: completed

## Outcome

Today shows one recommendation with the current lesson or kana row, a practical outcome and one primary action. The three marked groups move to a 250 px desktop sidebar and to a closed disclosure below the recommendation at narrower widths.

## Direction

- Product. Practical French and Japanese study for English-speaking adults.
- Character. Quiet, direct and warm.
- World. The established cream study notebook with dark ink and ruled lists.
- Moment. The actual recommended lesson and yellow start or resume action.
- Signature. A narrow page marker beside the active course and the recommendation.

The previous page gives the photograph and three secondary groups much of the available space. The recommendation repeats course length and resume metadata, and Japanese can show two launch cards.

## Implementation

Use existing course launch and layout tokens. Keep the route and recommendation logic in its existing owners. Build one set of study links for the wide sidebar and the narrow disclosure. Browser history should recover an expanded disclosure on the same visit.

## Validation

Repository and TypeScript checks passed. The targeted browser run and corrected reruns covered 62 distinct passing cases. Ten cold-offline cases passed, including the new Today links and Japanese course entry. French Lesson 3 resumed at the exact saved step and Japanese retained its kana start. Verified the desktop sidebar, 320 px disclosure, language switches, keyboard order, links and browser history.

## Handoff

Port 8082 serves build `6f21b50c2f194190628724d5152dbd807e329a4e2feee2a42cf2bafbd4a42fd3`. All 148 advertised assets matched the export. Visually checked the preview at 1440 and 320 px. [Design decision](../decisions/0047-today-study-navigation.md)

Design method adapted from unslop by Damir Sokolovsky, CC BY 4.0. [Unslop](https://heydamir.design/unslop)
