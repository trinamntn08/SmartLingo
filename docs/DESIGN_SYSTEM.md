# Learner design system

Reviewed 2026-11-22. The French and Japanese web learner and the local French editor use a warm neutral canvas, deep pine actions, gold highlights and white or lightly tinted surfaces. Layouts are built around individual tasks, with photos and study text in prominent positions. [Frontend decision](decisions/0035-full-frontend-rework.md)

## Source of shared values

[designTokens.ts](../apps/learner/src/ui/designTokens.ts) owns the existing semantic palette, spacing scale, type styles, radii, focus/disabled values, minimum control sizes and shell dimensions. [theme.ts](../apps/learner/src/ui/theme.ts) composes those values into React Native styles and continues to export `colors`, `styles` and `designTokens`.

Use tokens for shared decisions. Keep feature-specific layouts and artwork values with each feature. Shared visuals depend on the theme and base components. Learning, audio and storage concerns stay with their existing feature interfaces.

| Concern | Current value or owner |
| --- | --- |
| Canvas, surface, text, muted text, primary action, danger | Semantic `colors` values |
| Main body / secondary body / heading | Bundled Inter with a system fallback for Japanese. Size/line height in pixels is 18/28, 15/23 and 24/31. |
| Page titles and study targets | 39/47 page title with a 32/39 compact variant, and 36/46 target text with compact study adjustments |
| Shared card | 18 radius, 24 padding, minimal shadow |
| Touch targets | 44 minimum for icon controls; shared button 46 high; input 48 high |
| Keyboard focus | Explicit focus state; shared button outline 3 with offset 3 |
| Navigation and topic rail | Labelled bottom destinations below 1,000px. Learn uses a 250px topic rail from 1,050px and an inline topic selector at narrower widths. |
| Shell / ordinary content / Learn library maximum widths | 1536 / 1240 / 1320 pixels |

These values are current visual choices, not a mandate to override native accessibility scaling or a promise every feature-specific control already uses identical dimensions.

## Components and dependency direction

[ui/controls.tsx](../apps/learner/src/ui/controls.tsx) contains `Button` and `Badge`. The button supports compact, quiet, primary, gold accent and selected treatments. Shared [screen headings](../apps/learner/src/ui/ScreenHeader.tsx), [icons](../apps/learner/src/ui/Icon.tsx) and [context photography](../apps/learner/src/ui/ContextImage.tsx) compose with these controls. Preserve selected/disabled semantics, wrapping text, keyboard focus and visible error text when composing them.

[audio/Speak.tsx](../apps/learner/src/audio/Speak.tsx) owns the feature-specific speaker/stop control and optional French generated-audio options. It composes base buttons and audio adapters. Import `Speak` from this feature module, rather than routing audio dependencies through generic UI controls. French playback/generation boundaries and Japanese free/device playback remain unchanged.

The application shell lives in `src/app/`, Profile in `src/profile/`, and Today/Report widgets in `src/dashboard/`. They compose feature components. A new widget should receive the data/callbacks it needs; it should not open a database or invoke a provider while rendering. Existing progress/error/loading contracts remain with their feature models.

## Information hierarchy

Today leads with one photo-led recommendation followed by the guided daily course. Explore and practice groups direct links to vocabulary and lessons, listening and videos, and speaking. Saved words are available under Review. Topics belong in Learn, metrics in Report and settings in Profile. Pine identifies ordinary primary actions, gold highlights the lead recommendation and sage identifies selections. Keep meanings, examples, translations and reading aids visible during study.

The library shows topic covers alongside searchable lessons and vocabulary. The lesson canvas places readable word text before bounded photographs and keeps the read-only step outline separate from saved activity. Changing steps moves web focus to the new heading. Kana focuses on one row with an explicit row chooser and large glyphs. Daily-course day and section choices reflow when expanded. On narrow screens the Learn mode strip scrolls horizontally so the current activity remains near the top. Focus review hides the notebook while retaining unsaved form text. The editor has a lesson rail and an explicit draft, preview and publication sequence.

`ui/Disclosure` provides a named keyboard-accessible expansion button with expanded state and controlled content ID. Settings mount on first opening, then remain mounted and hidden when closed so backup/form state is retained. Optional AI uses `keepMounted={false}` to clear its temporary session/recording on collapse. See [ADR 0032](decisions/0032-calm-learner-interface.md).

## Extension and review

1. Reuse a current primitive and token when the same behavior/visual role exists. Extract a new shared component only after concrete reuse, rather than introducing a general widget framework.
2. Keep English interface copy and visible study support. Japanese reading aids and French grammar/gender are language-specific content, not theme logic.
3. Verify keyboard, narrow-width wrapping, focus, selected/disabled feedback, loading and recoverable errors in the affected journey. Do not rely on color alone or make speaking mandatory.
4. Preserve the seven [visual references](../references/AGENTS.md) when deliberately changing appearance. A structural extraction does not require a visual redesign.
5. Follow [testing](TESTING.md) and record actual checks in [the checkpoint](SESSION_CHECKPOINT.md). Written kana/romaji remain visible; further pronunciation content and owner acceptance of beginner pacing remain separate work.

Dark mode, a cross-application `packages/ui` package and broad typography preferences remain future work. The current learner is the only consumer requiring this shared design layer.
