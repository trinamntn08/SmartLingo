# Practical French curriculum research and rework

Latest follow-up, 2026-11-15: the [redundancy audit](CURRICULUM_REDUNDANCY_AUDIT.md) replaces 16 repeated introduction slots and clarifies two horaire senses. Current inventory is 705 canonical senses/696 written forms across the same 120 lessons/741 appearances. Five lessons append revision 4, fifty-five remain revision 3 and sixty remain revision 1. Exact old canonical payloads remain taught elsewhere; owner approval remains outstanding. Earlier rework findings/counts below describe the preceding checkpoint. Photograph coverage and voice choices are recorded separately in [photo coverage](PHOTO_COVERAGE.md) and [voice options](VOICE_OPTIONS.md).

Researched 2026-11-15, Europe/Paris. Owner request: review/rework every current topic and its words, expand useful topics, examples and courses. All runtime material remains an original AI-assisted draft requiring owner review. This is a practical beginner curriculum, not certification or a complete validated CEFR course.

## Evidence actually inspected

| Reference | Evidence type and supported use | Limits |
| --- | --- | --- |
| [Council of Europe global scale](https://www.coe.int/en/web/common-european-framework-reference-languages/table-1-cefr-3.3-common-reference-levels-global-scale) | Competence frame: A1 concrete everyday needs and personal exchanges; A2 routine information and immediate personal, shopping, local-area and employment needs. | Describes performance, not official word levels. Lesson labels are editorial estimates. |
| [TV5MONDE vocabulary catalogue](https://apprendre.tv5monde.com/fr/aides/vocabulaire) | Inspiration: everyday pharmacy, meals, kitchen, office, numbers, family and transport language. | Catalogue coverage informs scope; no word list or exercise copied. |
| [TV5MONDE pharmacy memo](https://apprendre.tv5monde.com/fr/aides/vocabulaire-la-pharmacie-0) | Inspiration: pharmacy language belongs in beginner practical exchanges. | Does not validate treatment advice or each SmartLingo health expression. |
| [CLE beginner vocabulary resources](https://progressive.cle-international.com/9782090398489) | Inspiration: adult beginners and communicative settings including invitations, directions, holidays, encounters and recipes. | Public resource labels inspected; recordings/exercises not imported. |
| [CLE complete beginner resources](https://progressive.cle-international.com/9782090382181) | Inspiration: a separate complete-beginner entry point supports scaffolding. | Bibliographic/resource page, not access to the book's contents. |
| [CLE intermediate resources](https://progressive.cle-international.com/9782090398571) | Inspiration: work and everyday-life situations support revisiting familiar domains. | Spans A2/B1; SmartLingo does not treat the whole resource as A2. |
| [Hachette Cosmopolite 1 contents](https://hachettefle.pl/wp-content/uploads/2022/07/Cosmopolite_1_spis_tresci.pdf) | Inspiration: broad links among introductions, dates, locations, accommodation, health, daily life, study, invitations, food, purchases and recent events. | Five-page contents used for triangulation only. SmartLingo uses its own order and original text. |

Actual access date: 2026-11-15. TV5MONDE, CLE and Hachette are independent FLE references; the Council of Europe supplies the competence frame. Coverage is compared across the course and audit notes below. Selecting individual words, prerequisites, early formulas and digital/paperwork/job-search tasks are editorial decisions, not source-prescribed inventories. No frequency corpus, exhaustive dictionary verification, native-speaker validation or independent human teaching trial was performed.

The CLE commercial product link returned 403; Didier companion A1/A2 pages redirected to inaccessible login; an attempted TV5 Première classe URL was inaccessible. No claims depend on unavailable contents. The earlier Facebook photo reference remains uninspected and unused. No proprietary vocabulary inventory, textbook dialogue, exercise, third-party image or recording was imported.

## Findings and changes

- Broad themes mixed objects, actions and incidental time words without always making the task clear. Keep useful nouns; replace weak/specialist padding with task-essential actions and chunks using new sense IDs.
- An eight-word example minimum made simple entries unnecessarily long. Use complete, natural examples appropriate to the lesson; a short request can be complete. English senses and translations remain visible.
- Several dialogues stopped before a practical response. Complete each exchange, clarify speaker roles/register, and bound grammar load.
- Foundations and connected A2 accounts needed explicit coverage. Add separate banks, allowing level-specific banks instead of forcing unsuitable A1/A2 symmetry.
- Canonical sense IDs and explicit aliases distinguish repeated practice from new senses. Shared senses have a canonical study card; dialogues provide contextual reuse.

Detailed editorial audit records cover [food, shopping, housing and travel](curriculum-food-audit.md), [daily life, health, people, services and work](curriculum-daily-audit.md), and [new foundations, communication and experiences](curriculum-expansion.md). These do not grant owner approval.

## Suggested progression

The [complete review catalogue](COURSE_CATALOGUE.md) lists all 24 banks, 120 lessons and targets: 741 vocabulary appearances, 689 canonical senses and 680 distinct written forms. There are four foundation, 65 A1 and 51 A2 lessons. Bank counts include deliberate recycling; they are not counts of newly learned words.

[course-sequence.ts](../packages/content/src/course-sequence.ts) records suggested prerequisites. Free exploration stays available; prerequisites are guidance, not app locks. Start with foundations and A1 lessons, returning to A2 lessons after relevant basics. Bank placement does not mean every lesson in an early bank precedes every lesson in a later bank.

| Stage | Topics | Purpose |
| --- | --- | --- |
| First exchanges | Essentials; Numbers; People and introductions; Calendar; Time and daily routine | Ask for help, repair understanding, exchange details and arrange a time. |
| Food and purchases | Bakery; Restaurant; Groceries; Cooking; Clothes and shopping | Request items, handle quantities, prepare food and explain a purchase problem. |
| Town and home | Directions; Transport; Home and housing; Accommodation | Find places, use transport, describe home and manage a stay. |
| Services, study and work | Health and appointments; Digital life; Services and paperwork; Education; Work and study; Job search | Describe needs, clarify instructions and take part in routine tasks. |
| Social interaction | Leisure and weather; Social plans; Past experiences; Opinions and choices | Agree on plans, recount an event and compare options. |

The original sixty lessons retain their IDs at revision 3; sixty added lessons start at revision 1. Immutable refresh accepts exact untouched historical seeds, preserving owner-edited heads and publications; [ADR 0015](decisions/0015-curriculum-rework.md) explains compatibility. Personal notebook examples and historical learning events are not rewritten. Repeated bank appearances are practice, not new senses.

## Learning and review limits

Short lessons contain 6–10 useful items, original bilingual examples, a can-do outcome, dialogue, optional grammar support, meaning/picture matching and sentence assembly. They provide supported recognition and guided production, not independent listening assessment, open conversation, native audio or proof of proficiency. Abstract vocabulary stays text-supported; a notebook is not a literal word picture. Existing media are reused only with matching IDs and targets.

Before publication, inspect French accuracy, articles/gender, English meanings, register, prerequisites, difficulty, relevance, dialogue roles, sentence alternatives and media in the saved-revision preview. Useful formulas may precede conjugation mastery with an explanation. Health/administration contexts teach language, without eligibility, legal-procedure or treatment advice. Automated checks establish structure and integrity, not teaching effectiveness or French correctness. Publication remains an explicit owner action.
