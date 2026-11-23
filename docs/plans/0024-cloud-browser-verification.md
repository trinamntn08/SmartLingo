# Task: Verify cloud browser interactions

Status: completed (browser verification); account-side Cloud activation remains separate
Owner: primary agent

## Outcome

Remote setup must verify the existing learner journeys on Linux, including narrow screens. Opening lessons, sending explicit fake-provider messages and selecting sentence tokens must respond to the first deliberate click without losing actions during focus/layout updates. Preserve keyboard focus visibility, persistence, disabled-state guards and offline behaviour.

## Relevant context

The initial GitHub run for [PR #1](https://github.com/trinamntn08/SmartLingo/pull/1) passes repository/TypeScript and 18 tooling/190 application tests. Chromium reports 67 passed, one intentional skip and 12 failed, mostly small-screen clicks that leave the preceding view visible. Offline tests did not run after that failure. No evidence yet establishes whether all failures share a cause. Existing UI/accessibility requirements and [architecture](../ARCHITECTURE.md) apply; no domain/storage changes are planned.

## Steps and ownership

1. Primary inspects remote logs and reproduces affected journeys in the isolated cloud worktree, using separate ports and fake providers.
2. Independent change-reviewer diagnoses captured error contexts/traces read-only. Primary owns UI changes, regression checks, workflow, dependency manifests (no change planned), docs and integration.
3. Apply the smallest evidence-backed fix, run meaningful affected checks, then rerun the remote full browser/offline workflow. Do not remove assertions or increase timeouts to conceal an interaction defect.
4. Record actual results, push a focused checkpoint and continue the cloud environment/phone acceptance handoff.

## Validation

Run repository/TypeScript and application checks; reproduce affected narrow lesson, AI-message and sentence journeys with Playwright. Verify keyboard focus and disabled controls remain usable. Collect the actual remote full-suite result. Keep owner8082/API3001 and original checkout untouched; tests route provider traffic to fake responses.

## Progress and decisions

Initial trace artifacts downloaded to ignored `.tmp/cloud-ci-failures` in the isolated worktree. Primary and independent review confirm that `Button` focus changed the border from 1px to 3px, adding four pixels of width. Traces show Open lesson, Send message and the sentence token mon moving to another row between pointer-down and pointer-up. Replaced that changing border width with a visible geometry-neutral outline; no selectors/assertions/timeouts were weakened.

Added a narrow focus/navigation regression. It fails on old source with width 143.59 -> 147.59 and height 48 -> 50, then passes after the fix. All 22 selected desktop/narrow lesson, conversation, recording, storage-failure, sentence and focus cases pass on isolated port8091. Both desktop/narrow backup journeys also pass. Their first isolated run hit a hardcoded8081 URL in the second context; changed that test to use the actual page URL, preserving isolation and all restore assertions. Repository/TypeScript checks pass; the complete remote result is recorded below.

Official style references checked: [React Native ViewStyle](https://reactnative.dev/docs/view-style-props) and [React Native Web styling](https://necolas.github.io/react-native-web/docs/styling/); installed React Native 0.88.1 declares the outline fields. Native focus rendering is not verified.

## Handoff

All 24 selected local browser cases pass. Fix checkpoint `5d80acb` is uploaded. [Full Linux run 43945569030](https://github.com/trinamntn08/SmartLingo/actions/runs/43945569030) passes repository/TypeScript checks, 18 tooling/190 application tests, 81 desktop/narrow browser cases with one intentional skip and all 8 offline cases. Its export contains 126 files / 9,692,048 bytes, build prefix `b1c6af23a4f4`. The initial 67-pass/12-failure run remains diagnostic history; no selector, assertion or timeout was weakened. Independent review found no unresolved actionable issue. Native focus rendering, owner physical-phone/audio and screen-reader checks are not claimed. Account-side environment initially prepared old main; it separately needs the current app branch, republishing and phone acceptance.
