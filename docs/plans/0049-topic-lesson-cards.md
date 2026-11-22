# Topic lesson cards and sequential study

Status: implemented for local review

## Outcome

Learn shows each topic's lessons as separate, numbered cards with purpose, duration, level and saved status. The first unfinished lesson stands out. Searching within a topic retains each lesson's position in the complete sequence. The lesson reader shows its position and offers the next lesson after completion. Learners can open any card and can return to the topic.

## Steps and ownership

The UI builder owns the topic page and cards. The primary owns sequence resolution, reader navigation, verification and the review build. The scope uses the existing catalogue order and progress contracts. Linked daily-course practice keeps its study-day return action.

## Validation

Check the card order and grouping at wide and narrow widths, saved and unfinished states, filtered numbering, direct completion-to-next navigation, terminal return, browser history, a restored or offline lesson, and the shared preview.
