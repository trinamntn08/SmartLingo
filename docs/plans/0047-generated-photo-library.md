# Replace stock photos with SmartLingo-generated photography

Status: completed
Owner: primary agent

## Outcome

All photographs bundled with the learner and editor use documented SmartLingo-generated sources. French vocabulary and topic covers use reviewed crops where they match the teaching purpose. Any unavailable or ambiguous image uses the existing illustration or text fallback. The app and new offline downloads have no stock images or photo credits page. Older distributions retain their original credits and rights records.

## Source and scope

The shared learner started from `1d7c6bc`. Initial UI work ran in an isolated worktree while the course outline was finishing. That work joined the primary learner on its verified `e35f03b` checkpoint so the same review preview can be rebuilt. Japanese presentation, French dialogue and homepage photos already have generated provenance. Day 1 French course text, font and voice credits have separate terms.

## Steps and ownership

1. Audit all runtime photo lookups and exported files. Review older offline cache behaviour.
2. Generate original photo sheets in the existing visual style. Review individual subjects, crops and exact stable ID/target associations.
3. Use a new photo URL directory, remove legacy collectors and exported stock files and remove the two app links to their credits. Preserve the archived rights evidence.
4. Check photo identity, application journeys and the offline export. Refresh the existing review preview and verify the served build.

## Validation

Run repository, TypeScript and application checks. Decode every generated photo in Chromium. Verify representative wide and narrow word/cover crops, photo failure behaviour, Learn and Profile, and a cold offline reload preserving study data. Confirm the manifest has no legacy photo paths or credit pages.

## Review and decisions

The generated photo catalogue preserves the same 397 exact vocabulary pairs. The visual reviewer identified a pale loaf in the first draft for du pain complet. A dedicated wholemeal-bread generation replaced that crop. The active learner uses new photo URLs to prevent a previous offline pack from answering those image requests with stock files. The historical credits remain attached to older builds and are archived in the repository history.

The standard Chromium suite passed 22 selected cases and the exported offline suite passed 14 selected cases. The updated 8082 build c3e0e5b4b7a1 decoded all 120 generated vocabulary photos in Chromium. It passed direct desktop and narrow walkthroughs and returned 404 for the retired credits page and stock coffee image. The export also includes the seven established generated scenes.
