# Learner design system

Reviewed 2026-11-27. The French and Japanese web learner and the local French editor use a cream canvas, nearly white paper, dark ink and quiet rules. Yellow marks the next action or the current page or study step. Original neighbourhood photography and bilingual study material hold the visual emphasis. [Frontend decision](decisions/0046-study-notebook-ui.md)

## Source of shared values

[designTokens.ts](../apps/learner/src/ui/designTokens.ts) owns the existing semantic palette, spacing scale, type styles, radii, focus/disabled values, minimum control sizes and shell dimensions. [theme.ts](../apps/learner/src/ui/theme.ts) composes those values into React Native styles and continues to export `colors`, `styles` and `designTokens`.

Use tokens for shared decisions. Keep feature-specific layouts and artwork values with each feature. Shared visuals depend on the theme and base components. Learning, audio and storage concerns stay with their existing feature interfaces.

| Concern | Current value or owner |
| --- | --- |
| Canvas, surface, text, muted text, primary action, danger | Semantic `colors` values |
| Main body / secondary body / heading | Bundled Inter with a system fallback for Japanese. Size/line height in pixels is 18/28, 16/24 and 26/32. |
| Page titles and study targets | 40/48 page title with a 32/40 compact variant, and 36/48 target text with compact study adjustments. The chooser and Today use a system serif for their large English headings. |
| Shared card | 16 radius, 24 padding and a subtle neutral shadow |
| Touch targets | 44 minimum for icon controls. The standard shared button and input are at least 48 pixels high. |
| Keyboard focus | Explicit focus state; shared button outline 3 with offset 3 |
| Navigation and topic rail | Labelled bottom destinations below 1,100px for French and 1,000px for Japanese. Learn uses a 250px topic rail from 1,050px and an inline topic selector at narrower widths. |
| Shell / ordinary content / Learn library maximum widths | 1536 / 1240 / 1320 pixels |

These values are current visual choices, not a mandate to override native accessibility scaling or a promise every feature-specific control already uses identical dimensions.

## Components and dependency direction

[ui/controls.tsx](../apps/learner/src/ui/controls.tsx) contains `Button` and `Badge`. The button supports compact, quiet, primary, gold accent and selected treatments. Shared [screen headings](../apps/learner/src/ui/ScreenHeader.tsx), [icons](../apps/learner/src/ui/Icon.tsx) and [context photography](../apps/learner/src/ui/ContextImage.tsx) compose with these controls. Preserve selected/disabled semantics, wrapping text, keyboard focus and visible error text when composing them.

[audio/Speak.tsx](../apps/learner/src/audio/Speak.tsx) owns the feature-specific speaker/stop control and optional French generated-audio options. It composes base buttons and audio adapters. Import `Speak` from this feature module, rather than routing audio dependencies through generic UI controls. French playback/generation boundaries and Japanese free/device playback remain unchanged.

The application shell lives in `src/app/`, Profile in `src/profile/`, and Today/Report widgets in `src/dashboard/`. They compose feature components. A new widget should receive the data/callbacks it needs; it should not open a database or invoke a provider while rendering. Existing progress/error/loading contracts remain with their feature models.

## Information hierarchy

Today leads with one recommendation and an adjoining photograph. Other courses and ruled links offer direct access to lessons, listening and speaking. Review opens saved words. Topics belong in Learn, metrics in Report and settings in Profile. Green indicates selection or feedback where useful. Keep meanings, examples, translations and reading aids visible during study.

The library shows topic covers alongside searchable lessons and vocabulary. The lesson canvas opens on the active material and puts readable study text alongside contextual photography where available. Five numbered lesson steps share a ruled strip with a yellow current-step marker. On phones the number sits above the short label. Choosing a step moves web focus to its heading. The separate progress bar reflects saved activity. The listening player puts playback and the transcript toggle together, followed by the question and feedback. Kana puts the character grid, audio and the practice action first. The course outline reflows when expanded. Focus review hides the notebook and retains unsaved form text. The editor uses a ruled lesson rail and an explicit draft, preview and publication sequence.

`ui/Disclosure` provides a named keyboard-accessible expansion button with expanded state and controlled content ID. Settings mount on first opening, then remain mounted and hidden when closed so backup/form state is retained. Optional AI uses `keepMounted={false}` to clear its temporary session/recording on collapse. See [ADR 0032](decisions/0032-calm-learner-interface.md).

## Extension and review

1. Reuse a current primitive and token when the same behavior/visual role exists. Extract a new shared component only after concrete reuse, rather than introducing a general widget framework.
2. Keep English interface copy and visible study support. Japanese reading aids and French grammar/gender are language-specific content, not theme logic.
3. Verify keyboard, narrow-width wrapping, focus, selected/disabled feedback, loading and recoverable errors in the affected journey. Do not rely on color alone or make speaking mandatory.
4. Preserve the seven [visual references](../references/AGENTS.md) when deliberately changing appearance. A structural extraction does not require a visual redesign.
5. Follow [testing](TESTING.md) and record actual checks in [the checkpoint](SESSION_CHECKPOINT.md). Written kana/romaji remain visible; further pronunciation content and owner acceptance of beginner pacing remain separate work.

Dark mode, a cross-application `packages/ui` package and broad typography preferences remain future work. The current learner is the only consumer requiring this shared design layer.
