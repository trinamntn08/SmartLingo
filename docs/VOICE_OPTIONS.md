# French voice options

This document covers French only. The current learner also has language-specific Japanese device voices and an optional free local voice fallback; see [Japanese audio](JAPANESE_AUDIO.md). Its original dated provider research below has not been revalidated by the 2026-11-22 documentation refresh.

Provider/platform research checked 2026-11-15; the implemented-code description was reviewed 2026-11-16. External catalogues, prices and model availability must be rechecked before a provider change. This is a technical comparison, not a listening assessment. No paid generation, provider credentials, recordings or owner learner data were used.

Owner preference: natural, calm French with no gender preference. The current implementation provides an explicit Azure audition/save flow for Denise/Henri with gentle neutral pacing, not a declared voice-quality winner. It caches verified clips for offline replay and keeps ordinary playback free of generation calls. [Setup and privacy boundaries](../README.md#optional-saved-neural-french-audio), [decision](decisions/0018-explicit-cached-neural-speech.md). Actual provider quality remains unverified without the owner's listening test.

## Improvement available now

Profile's French audio panel lists the French voices that this browser exposes, allows an explicit voice choice, offers Slow (0.7×), Gentle (0.85×) and Normal (1×), and plays a French sample with its English meaning displayed only on Preview. Existing lesson, notebook and AI reply speaker buttons use the same setting. Preview can be stopped; changing settings stops current speech. Browser speech errors retain visible lesson text.

Automatic selection prefers local `fr-FR`, then another `fr-FR`, then another local French voice, then the first remaining French voice. This is a locality/locale policy, not a quality ranking. Explicit selection takes priority. If that voice disappears, playback falls back and Profile explains the temporary replacement; the saved choice can return when the voice does.

Settings use the separate versioned `smartlingo.audio-preferences.v1` browser localStorage key. They contain only voice identity and speed, are not learner history, and are not included in learner backups. Blocked storage retains the setting for the current visit and shows that persistence failed. Different browser origins/profiles have separate settings. Native audio remains future work.

## Browser constraints

The voice list comes from the current device/browser; SmartLingo cannot install or manufacture a better voice. The panel handles delayed discovery and subsequent `voiceschanged` events, and includes manual refresh. An empty list keeps text study usable and suggests installing French speech in device settings. [MDN getVoices](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices), [MDN voiceschanged](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/voiceschanged_event).

The browser's `localService` flag distinguishes device from remote synthesis. Device speech may work offline after installation; remote speech can require connectivity and transmit spoken text to its service. App asset downloads do not include voices. This flag does not certify sound quality, offline readiness, or a provider's data policy. [MDN localService](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice/localService).

The 2026-11-15 investigation consulted Microsoft's Narrator documentation, which is separate from browser Web Speech exposure. Do not promise that installing a Narrator voice changes SmartLingo. Refresh the app's actual voice list to see what is available; this documentation cleanup installed no Windows voices or settings. Check Microsoft's [supported voices](https://support.microsoft.com/en-au/accessibility/windows/narrator/appendix-a-supported-languages-and-voices) and [Narrator guide](https://support.microsoft.com/en-us/accessibility/windows/narrator/complete-guide-to-narrator) for current OS instructions.

## Available engines and further audition candidates

| Option | What to audition | Network, cost and integration |
| --- | --- | --- |
| Browser device voices | Every available France-French voice, at Gentle and Normal speed. No universal best name can be inferred across devices. | Implemented now. No SmartLingo paid generation or AI key. Availability and offline behaviour depend on the device. |
| Azure Speech | Implemented audition candidates: `fr-FR-DeniseNeural`, `fr-FR-HenriNeural`. Additional voices/HD variants are not integrated. No asserted quality order. | A server REST adapter and verified cache are implemented for Denise/Henri. Azure configuration and explicit network generation are required for a new clip. Check current account/provider pricing before generation; no numeric clip-cost quote is asserted. |
| OpenAI speech generation | Not implemented; conversation/transcription support is a separate feature. | A new speech provider requires fresh official API/model/pricing research and an adapter/cache implementation. No current replacement model or migration is prescribed by this dated investigation. |

Use current [Azure voice support](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts), [speech documentation](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/text-to-speech) and [pricing](https://azure.microsoft.com/en-us/pricing/details/speech/) when configuring or expanding the provider. These external catalogues were not revalidated during this documentation-only cleanup.

The original model/deprecation and price observations are recoverable with `git show cf4fedb:docs/VOICE_OPTIONS.md`; they are not maintained as current recommendations here. Before an OpenAI speech integration, inspect the official [speech guide](https://developers.openai.com/api/docs/guides/text-to-speech), [deprecations](https://developers.openai.com/api/docs/deprecations) and [pricing](https://developers.openai.com/api/docs/pricing). Synthetic speech must remain disclosed; product marketing or a general voice recommendation does not establish French teaching quality.

For the current app, audition the exposed device voices and explicitly saved Azure Denise/Henri clips using the checklist below. A further provider comparison is separate research and implementation; no provider is claimed to sound better without listening.

## Listening acceptance and later provider expansion

Use the same samples for each candidate: “Bonjour ! Je voudrais un café, s’il vous plaît.”; “L’addition, s’il vous plaît.”; “Nous avons un rendez-vous à neuf heures.”; “Il y a deux euros et cinquante centimes.” Compare natural metropolitan French, liaison, numbers, pace and clarity on the intended desktop and phone. Have the owner or a competent French speaker approve the result; product labels and marketing claims are insufficient evidence.

The implemented Azure journey keeps permanent credentials server-side, requires explicit bounded generation, retains device/text fallback, and caches by version/provider/text/language/format/voice/pace identity. Saved verified clips replay offline without another paid call; a saved clip is not automatically owner-approved teaching audio. Provider processing is distinct from local server/browser retention. Additional providers, HD voices, bulk packs and a real quality comparison remain future work.

## Verification

Deterministic tests cover French locale/locality preference, explicit choice, missing voice fallback, delayed list availability, selected locale and speed, storage reload/corruption/denial, synchronous engine failure, and listener cleanup without replacing another subscriber. The latest executed results belong in [the checkpoint](SESSION_CHECKPOINT.md). Real audible quality, OS voice installation and physical-phone/offline voice behaviour still need listening checks.
