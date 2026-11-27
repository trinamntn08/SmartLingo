# Session checkpoint

Updated 2026-11-27 UTC. The material-first learner redesign is on `feat/material-first-lessons` in `/workspace/SmartLingo`. The commit containing this note is the local checkpoint.

## Source and implementation

Verified all 69 origin branch heads. The task started from `afe9d7e1df57328cfc8c8004b73b4141819b7581` on the Japanese curriculum branch. That source includes the phone redesign, bundled audio clips and the lesson in the reference image. The separate native speech plugin at `368a42f` and the older hosted app at `c88bc41` have independent release targets. This change uses the existing learner audio path.

The UI work covered kana study and recognition entry, shared vocabulary lists, responsive navigation and the five learner screens. Three UI builders and an independent read-only reviewer used the inherited session model. The review caught a script chooser that navigated before a row was selected, and an unavailable Profile action in an empty state. Both were corrected.

## Verification

Repository checks, TypeScript, all 344 tooling/application tests, 253 browser cases including reruns, 34 offline cases and eight Android browser contracts passed. The browser matrix skips one duplicate editor publication by design. See the [work log](WORK_LOG.md) and [mobile screenshot](screenshots/material-first-vowels.png). Usage telemetry was unavailable. No automatic resumption was configured.
