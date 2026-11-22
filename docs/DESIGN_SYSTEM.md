# Learner design system

Reviewed: 2026-11-22. The shared French/Japanese web learner retains its cream, burgundy and gold appearance. This is a guide to the implemented design boundary, not a claim of a complete component library or accessibility certification.

## Source of shared values

[designTokens.ts](../apps/learner/src/ui/designTokens.ts) owns the existing semantic palette, spacing scale, type styles, radii, focus/disabled values, minimum control sizes and shell dimensions. [theme.ts](../apps/learner/src/ui/theme.ts) composes those values into React Native styles and continues to export `colors`, `styles` and `designTokens`.

Use tokens for shared decisions. Keep genuinely feature-specific layout and artwork values with that feature; do not turn every number into a global token. The current refactor preserves existing sizes/colors and adopts tokens in shared styles, base buttons, speech controls and the app shell. Existing feature components still contain local styles; they have not all been restyled or mechanically rewritten.

| Concern | Current value or owner |
| --- | --- |
| Canvas, surface, text, muted text, primary action, danger | Semantic `colors` values |
| Main body / secondary body / heading | 17/26, 15/23 and 24/31 font size/line height |
| Shared card | 28 radius, 24 padding, subtle shadow |
| Touch targets | 44 minimum for icon controls; shared button 46 high; input 48 high |
| Keyboard focus | Explicit focus state; shared button outline 3 with offset 3 |
| Compact content / desktop sidebar thresholds | 600 / 1050 pixels |
| Shell / content maximum widths | 1440 / 1160 pixels |

These values are current visual choices, not a mandate to override native accessibility scaling or a promise every feature-specific control already uses identical dimensions.

## Components and dependency direction

[ui/controls.tsx](../apps/learner/src/ui/controls.tsx) contains only `Button` and `Badge`. These primitives depend on React Native and the theme, not speech engines, storage, network clients or provider preferences. Preserve selected/disabled semantics, wrapping text, keyboard focus and visible error text when composing them.

[audio/Speak.tsx](../apps/learner/src/audio/Speak.tsx) owns the feature-specific speaker/stop control and optional French generated-audio options. It composes base buttons and audio adapters. Import `Speak` from this feature module, rather than routing audio dependencies through generic UI controls. French playback/generation boundaries and Japanese free/device playback remain unchanged.

The application shell lives in `src/app/`, Profile in `src/profile/`, and Today/Report widgets in `src/dashboard/`. They compose feature components. A new widget should receive the data/callbacks it needs; it should not open a database or invoke a provider while rendering. Existing progress/error/loading contracts remain with their feature models.

## Extension and review

1. Reuse a current primitive and token when the same behavior/visual role exists. Extract a new shared component only after concrete reuse, rather than introducing a general widget framework.
2. Keep English interface copy and visible study support. Japanese reading aids and French grammar/gender are language-specific content, not theme logic.
3. Verify keyboard, narrow-width wrapping, focus, selected/disabled feedback, loading and recoverable errors in the affected journey. Do not rely on color alone or make speaking mandatory.
4. Preserve the seven [visual references](../references/AGENTS.md) when deliberately changing appearance. A structural extraction does not require a visual redesign.
5. Follow [testing](TESTING.md) and record actual checks in [the checkpoint](SESSION_CHECKPOINT.md). The earlier owner request for gentler kana pacing and clearer pronunciation needs its own learner-facing implementation and review; design tokens alone do not deliver it.

Dark mode, a cross-application `packages/ui` package and broad typography preferences remain future work. The current learner is the only consumer requiring this shared design layer.
