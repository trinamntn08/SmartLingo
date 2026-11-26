# Task: Redesign the Android phone learner

Status: completed.

Owner: primary agent

## Outcome

On a narrow screen, Today offers one immediate study action. Learn gives access to the current course, topics and skills. A course picker reveals the available levels and opens a single course outline. A learner can resume the chosen course and use existing lesson links and learning data. Deliver version code 4 of the same signed Android package and matched APK screenshots.

## Steps and ownership

1. Open the verified version 3 package and inspect Today, Learn, the course choices and a lesson in small portrait. Capture each screen using the dedicated emulator.
2. Implement Today, Learn, the course picker and shared navigation in the primary worktree. Delegate the lesson reader and secondary screens with exclusive UI file ownership. Preserve all study content and event identities.
3. Exercise narrow and wide browser layouts, offline routes and the Android shell contracts. Review the scoped changes independently.
4. Build the signed APK, compare it with version 3 and verify an offline in-place emulator update using French and Japanese progress and notebook entries recorded through the app. Review and capture the matching redesigned screens.

## Validation

Run the repository, tooling, application, Chromium, offline and Android contract checks. Test both languages, kana, review, saved steps, course selection, system Back, cold offline, large system fonts, keyboard, rotation, and gesture navigation. Record emulator and physical-device coverage independently.

## Progress and decisions

The verified version 3 upgrade is the baseline. UI Designer is unavailable in this session. The actual APK supplies the before and after screenshots for design review. No new artwork is required.

### Portrait review and layout

The version 3 APK at 360 dp placed a full outcome, a lesson-count badge and a photo around Today’s action. Learn showed two extra course cards before the study tools. The lesson’s separate brand and course headers, outcome and progress controls pushed the first conversation line below the initial viewport.

- **Today**. One warm study card, a compact title and a full-width Start or Continue action. The existing contextual photo sits below the action.
- **Learn**. The current course or Japanese letters lead. Courses opens the level list. A row of icon-and-label tools reaches topics, listening, speaking, and letters or slang. Topic search is visible with levels behind a filter icon.
- **Courses**. A history-backed list marks the current course. Picking a course opens its lesson list and start or resume action. The existing course event stream supplies independent saved positions.
- **Lesson**. A smaller Back and Outline toolbar, five numbered steps with spoken labels, and a prominent continuation control. French and English transcripts stay complete and Japanese readings stay with the study content.
- **Review, Report, Profile**. Compact notebook and a focused recall route, essential report measures and weekly activity, and short expandable settings. Audio and backups remain available.

[Decision](../decisions/0047-phone-study-and-course-selection.md)

## Handoff

The signed APK, clean build receipt and matched screenshots are in `dist/android`. The exact offline emulator update kept both notebooks and lesson positions. The 320 dp and maximum-text checks included the long Japanese written reading and its neighboring actions. Physical-device verification remains open. [Verification record](../WORK_LOG.md#2026-11-26-redesign-the-android-phone-learner)
